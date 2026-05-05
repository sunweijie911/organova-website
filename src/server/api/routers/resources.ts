import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { resources } from '@/server/db/schema';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const resourceWriteSchema = z.object({
  name: z.string().min(1).max(256),
  description: z.string().optional(),
  ctaLabel: z.string().max(128).optional(),
  ctaType: z.enum(['download', 'link', 'contact']),
  fileUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  isVisible: z.boolean(),
  sortOrder: z.number().int(),
});

export const resourcesRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(resources)
      .where(eq(resources.isVisible, true))
      .orderBy(asc(resources.sortOrder));
  }),

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(resources).orderBy(asc(resources.sortOrder));
  }),

  adminCreate: adminProcedure
    .input(resourceWriteSchema)
    .mutation(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .insert(resources)
        .values(input)
        .returning({ id: resources.id });
      return row;
    }),

  adminUpdate: adminProcedure
    .input(z.object({ id: z.number().int() }).merge(resourceWriteSchema))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const [existing] = await ctx.db
        .select({ id: resources.id })
        .from(resources)
        .where(eq(resources.id, id))
        .limit(1);
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND' });
      await ctx.db.update(resources).set(data).where(eq(resources.id, id));
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(resources).where(eq(resources.id, input.id));
      return { success: true };
    }),

  adminUpdateSort: adminProcedure
    .input(
      z.array(z.object({ id: z.number().int(), sortOrder: z.number().int() })),
    )
    .mutation(async ({ input, ctx }) => {
      await Promise.all(
        input.map(({ id, sortOrder }) =>
          ctx.db
            .update(resources)
            .set({ sortOrder })
            .where(eq(resources.id, id)),
        ),
      );
      return { success: true };
    }),
});
