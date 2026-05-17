import { TRPCError } from '@trpc/server';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { news } from '@/server/db/schema';
import { assertUpdated } from '@/server/db/utils';
import { deleteFileIfChanged } from '@/server/services/storage';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const newsWriteSchema = z.object({
  title: z.string().min(1).max(512),
  publishedAt: z.date(),
  location: z.string().max(256).optional(),
  content: z.string().max(50_000).optional(),
  coverImage: z.string().nullable().optional(),
  isPublished: z.boolean().default(false),
});

export const newsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ year: z.number().int().min(1900).max(2100).optional() }))
    .query(async ({ input, ctx }) => {
      return ctx.db
        .select()
        .from(news)
        .where(
          input.year
            ? and(
                eq(news.isPublished, true),
                sql<boolean>`extract(year from ${news.publishedAt})::int = ${input.year}`,
              )
            : eq(news.isPublished, true),
        )
        .orderBy(desc(news.publishedAt));
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(news)
        .where(and(eq(news.id, input.id), eq(news.isPublished, true)))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  availableYears: publicProcedure.query(async ({ ctx }) => {
    // Postgres 要求 SELECT DISTINCT 的 ORDER BY 表达式必须出现在 select 列表中，
    // 因此 orderBy 这里必须复用 select 中带 ::int cast 的同一表达式
    const yearExpr = sql<number>`extract(year from ${news.publishedAt})::int`;
    const rows = await ctx.db
      .selectDistinct({ year: yearExpr })
      .from(news)
      .where(eq(news.isPublished, true))
      .orderBy(desc(yearExpr));
    return rows.map((r) => r.year);
  }),

  adminList: adminProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(100).default(20),
        })
        .default({ page: 1, pageSize: 20 }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;
      const [rows, total] = await Promise.all([
        ctx.db
          .select()
          .from(news)
          .orderBy(desc(news.publishedAt))
          .limit(pageSize)
          .offset(offset),
        ctx.db.$count(news),
      ]);
      return { items: rows, total, page, pageSize };
    }),

  adminGet: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(news)
        .where(eq(news.id, input.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminCreate: adminProcedure
    .input(newsWriteSchema)
    .mutation(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .insert(news)
        .values(input)
        .returning({ id: news.id });
      return row;
    }),

  adminUpdate: adminProcedure
    .input(z.object({ id: z.number().int() }).merge(newsWriteSchema))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const [before] = await ctx.db
        .select({ coverImage: news.coverImage })
        .from(news)
        .where(eq(news.id, id))
        .limit(1);
      const result = await ctx.db
        .update(news)
        .set(data)
        .where(eq(news.id, id))
        .returning({ id: news.id });
      assertUpdated(result);
      deleteFileIfChanged(before?.coverImage, data.coverImage);
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const [before] = await ctx.db
        .select({ coverImage: news.coverImage })
        .from(news)
        .where(eq(news.id, input.id))
        .limit(1);
      const result = await ctx.db
        .delete(news)
        .where(eq(news.id, input.id))
        .returning({ id: news.id });
      assertUpdated(result);
      deleteFileIfChanged(before?.coverImage, null);
      return { success: true };
    }),

  adminTogglePublish: adminProcedure
    .input(z.object({ id: z.number().int(), isPublished: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(news)
        .set({ isPublished: input.isPublished })
        .where(eq(news.id, input.id))
        .returning({ id: news.id });
      assertUpdated(result);
      return { success: true };
    }),
});
