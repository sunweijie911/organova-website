import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { resources } from '@/server/db/schema';
import { assertUpdated } from '@/server/db/utils';
import { deleteFileIfChanged } from '@/server/services/storage';
import { RESOURCE_CTA_TYPES } from '@/types/enums';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const resourceWriteSchema = z.object({
  name: z.string().min(1).max(256),
  description: z.string().max(10_000).optional(),
  ctaLabel: z.string().max(128).optional(),
  ctaType: z.enum(RESOURCE_CTA_TYPES),
  fileUrl: z.string().nullable().optional(),
  externalUrl: z.string().nullable().optional(),
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
      const [before] = await ctx.db
        .select({ fileUrl: resources.fileUrl })
        .from(resources)
        .where(eq(resources.id, id))
        .limit(1);
      const result = await ctx.db
        .update(resources)
        .set(data)
        .where(eq(resources.id, id))
        .returning({ id: resources.id });
      assertUpdated(result);
      deleteFileIfChanged(before?.fileUrl, data.fileUrl);
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const [before] = await ctx.db
        .select({ fileUrl: resources.fileUrl })
        .from(resources)
        .where(eq(resources.id, input.id))
        .limit(1);
      const result = await ctx.db
        .delete(resources)
        .where(eq(resources.id, input.id))
        .returning({ id: resources.id });
      assertUpdated(result);
      deleteFileIfChanged(before?.fileUrl, null);
      return { success: true };
    }),

  adminToggleVisible: adminProcedure
    .input(z.object({ id: z.number().int(), isVisible: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(resources)
        .set({ isVisible: input.isVisible })
        .where(eq(resources.id, input.id))
        .returning({ id: resources.id });
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
            .update(resources)
            .set({ sortOrder })
            .where(eq(resources.id, id));
        }
      });
      return { success: true };
    }),
});
