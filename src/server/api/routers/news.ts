import { TRPCError } from '@trpc/server';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { news } from '@/server/db/schema';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const newsWriteSchema = z.object({
  title: z.string().min(1).max(512),
  publishedAt: z.date(),
  location: z.string().max(256).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const newsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ year: z.number().int().optional() }))
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

  availableYears: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .selectDistinct({
        year: sql<number>`extract(year from ${news.publishedAt})::int`,
      })
      .from(news)
      .where(eq(news.isPublished, true))
      .orderBy(desc(sql`extract(year from ${news.publishedAt})`));
    return rows.map((r) => r.year);
  }),

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(news).orderBy(desc(news.publishedAt));
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
      await ctx.db.update(news).set(data).where(eq(news.id, id));
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(news).where(eq(news.id, input.id));
      return { success: true };
    }),

  adminTogglePublish: adminProcedure
    .input(z.object({ id: z.number().int(), isPublished: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(news)
        .set({ isPublished: input.isPublished })
        .where(eq(news.id, input.id));
      return { success: true };
    }),
});
