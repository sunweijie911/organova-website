import { TRPCError } from '@trpc/server';
import { asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { publications } from '@/server/db/schema';
import { assertUpdated } from '@/server/db/utils';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const publicationWriteSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  journal: z.string().min(1).max(256),
  title: z.string().min(1).max(2000),
  authors: z.string().min(1).max(512),
  citationCount: z.string().max(64).nullish(),
  doi: z.string().max(256).nullish(),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export const publicationsRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(publications)
      .where(eq(publications.isVisible, true))
      .orderBy(asc(publications.sortOrder), desc(publications.year));
  }),

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(publications)
      .orderBy(asc(publications.sortOrder), desc(publications.year));
  }),

  adminGet: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(publications)
        .where(eq(publications.id, input.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminCreate: adminProcedure
    .input(publicationWriteSchema)
    .mutation(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .insert(publications)
        .values(input)
        .returning({ id: publications.id });
      return row;
    }),

  adminUpdate: adminProcedure
    .input(z.object({ id: z.number().int() }).merge(publicationWriteSchema))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const result = await ctx.db
        .update(publications)
        .set(data)
        .where(eq(publications.id, id))
        .returning({ id: publications.id });
      assertUpdated(result);
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .delete(publications)
        .where(eq(publications.id, input.id))
        .returning({ id: publications.id });
      assertUpdated(result);
      return { success: true };
    }),

  adminToggleVisible: adminProcedure
    .input(z.object({ id: z.number().int(), isVisible: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(publications)
        .set({ isVisible: input.isVisible })
        .where(eq(publications.id, input.id))
        .returning({ id: publications.id });
      assertUpdated(result);
      return { success: true };
    }),

  adminUpdateSort: adminProcedure
    .input(
      z
        .array(z.object({ id: z.number().int(), sortOrder: z.number().int() }))
        .max(500),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        for (const { id, sortOrder } of input) {
          await tx
            .update(publications)
            .set({ sortOrder })
            .where(eq(publications.id, id));
        }
      });
      return { success: true };
    }),
});
