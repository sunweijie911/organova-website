import { TRPCError } from '@trpc/server';
import { and, asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { cancerTypes } from '@/server/db/schema';
import { assertUpdated, isUniqueViolation } from '@/server/db/utils';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const cancerTypeWriteSchema = z.object({
  name: z.string().min(1).max(256),
  slug: z.string().min(1).max(256),
  modelCount: z.string().max(64).optional(),
  formats: z.string().max(128).optional(),
  coverImage: z.string().nullable().optional(),
  subpageTitle: z.string().max(512).optional(),
  modelCountDetail: z.string().optional(),
  validationMethods: z.string().optional(),
  validatedApplications: z.string().optional(),
  clinicalCorrelation: z.string().optional(),
  cta1Label: z.string().max(128).optional(),
  cta1Url: z.string().max(512).optional(),
  cta2Label: z.string().max(128).optional(),
  cta2Url: z.string().max(512).optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const cancerTypesRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(cancerTypes)
      .where(eq(cancerTypes.isPublished, true))
      .orderBy(asc(cancerTypes.sortOrder), desc(cancerTypes.createdAt));
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(cancerTypes)
        .where(
          and(
            eq(cancerTypes.slug, input.slug),
            eq(cancerTypes.isPublished, true),
          ),
        )
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(cancerTypes)
      .orderBy(asc(cancerTypes.sortOrder), desc(cancerTypes.createdAt));
  }),

  adminGet: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(cancerTypes)
        .where(eq(cancerTypes.id, input.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminCreate: adminProcedure
    .input(cancerTypeWriteSchema)
    .mutation(async ({ input, ctx }) => {
      // 直接走数据库 unique 约束，避免 select-then-insert 的 TOCTOU 竞争
      try {
        const [row] = await ctx.db
          .insert(cancerTypes)
          .values(input)
          .returning({ id: cancerTypes.id });
        return row;
      } catch (err) {
        if (isUniqueViolation(err)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Slug "${input.slug}" 已存在`,
          });
        }
        throw err;
      }
    }),

  adminUpdate: adminProcedure
    .input(z.object({ id: z.number().int() }).merge(cancerTypeWriteSchema))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      let result: { id: number }[];
      try {
        result = await ctx.db
          .update(cancerTypes)
          .set(data)
          .where(eq(cancerTypes.id, id))
          .returning({ id: cancerTypes.id });
      } catch (err) {
        if (isUniqueViolation(err)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Slug "${data.slug}" 已被其他记录使用`,
          });
        }
        throw err;
      }
      assertUpdated(result);
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .delete(cancerTypes)
        .where(eq(cancerTypes.id, input.id))
        .returning({ id: cancerTypes.id });
      assertUpdated(result);
      return { success: true };
    }),

  adminTogglePublish: adminProcedure
    .input(z.object({ id: z.number().int(), isPublished: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(cancerTypes)
        .set({ isPublished: input.isPublished })
        .where(eq(cancerTypes.id, input.id))
        .returning({ id: cancerTypes.id });
      assertUpdated(result);
      return { success: true };
    }),

  adminUpdateSort: adminProcedure
    .input(
      z.array(z.object({ id: z.number().int(), sortOrder: z.number().int() })),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        for (const { id, sortOrder } of input) {
          await tx
            .update(cancerTypes)
            .set({ sortOrder })
            .where(eq(cancerTypes.id, id));
        }
      });
      return { success: true };
    }),
});
