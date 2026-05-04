import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { faqCategories, faqItems } from '@/server/db/schema';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

export const faqRouter = createTRPCRouter({
  // 门户：获取所有可见分类及条目
  listWithItems: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db
      .select()
      .from(faqCategories)
      .where(eq(faqCategories.isVisible, true))
      .orderBy(asc(faqCategories.sortOrder));

    const items = await ctx.db
      .select()
      .from(faqItems)
      .where(eq(faqItems.isVisible, true))
      .orderBy(asc(faqItems.sortOrder));

    return categories.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.categoryId === cat.id),
    }));
  }),

  // 后台：分类管理
  adminListCategories: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(faqCategories)
      .orderBy(asc(faqCategories.sortOrder));
  }),

  adminCreateCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        sortOrder: z.number().int().default(0),
        isVisible: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .insert(faqCategories)
        .values(input)
        .returning({ id: faqCategories.id });
      return row;
    }),

  adminUpdateCategory: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(1).max(256),
        sortOrder: z.number().int(),
        isVisible: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      await ctx.db
        .update(faqCategories)
        .set(data)
        .where(eq(faqCategories.id, id));
      return { success: true };
    }),

  adminDeleteCategory: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(faqCategories).where(eq(faqCategories.id, input.id));
      return { success: true };
    }),

  // 后台：条目管理
  adminListItems: adminProcedure
    .input(z.object({ categoryId: z.number().int() }))
    .query(async ({ input, ctx }) => {
      return ctx.db
        .select()
        .from(faqItems)
        .where(eq(faqItems.categoryId, input.categoryId))
        .orderBy(asc(faqItems.sortOrder));
    }),

  adminGetItem: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(faqItems)
        .where(eq(faqItems.id, input.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminCreateItem: adminProcedure
    .input(
      z.object({
        categoryId: z.number().int(),
        question: z.string().min(1),
        answer: z.string().min(1),
        sortOrder: z.number().int().default(0),
        isVisible: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .insert(faqItems)
        .values(input)
        .returning({ id: faqItems.id });
      return row;
    }),

  adminUpdateItem: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        categoryId: z.number().int(),
        question: z.string().min(1),
        answer: z.string().min(1),
        sortOrder: z.number().int(),
        isVisible: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      await ctx.db.update(faqItems).set(data).where(eq(faqItems.id, id));
      return { success: true };
    }),

  adminDeleteItem: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(faqItems).where(eq(faqItems.id, input.id));
      return { success: true };
    }),

  adminUpdateCategorySort: adminProcedure
    .input(
      z.array(z.object({ id: z.number().int(), sortOrder: z.number().int() })),
    )
    .mutation(async ({ input, ctx }) => {
      await Promise.all(
        input.map(({ id, sortOrder }) =>
          ctx.db
            .update(faqCategories)
            .set({ sortOrder })
            .where(eq(faqCategories.id, id)),
        ),
      );
      return { success: true };
    }),

  adminUpdateItemSort: adminProcedure
    .input(
      z.array(z.object({ id: z.number().int(), sortOrder: z.number().int() })),
    )
    .mutation(async ({ input, ctx }) => {
      await Promise.all(
        input.map(({ id, sortOrder }) =>
          ctx.db.update(faqItems).set({ sortOrder }).where(eq(faqItems.id, id)),
        ),
      );
      return { success: true };
    }),
});
