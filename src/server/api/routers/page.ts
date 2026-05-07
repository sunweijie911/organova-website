import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { systemConfig } from '@/server/db/schema';
import { adminProcedure, createTRPCRouter } from '../trpc';

const FRONTEND_CONFIG_KEY = 'frontend';

export const pageRouter = createTRPCRouter({
  getFrontendConfig: adminProcedure.query(async ({ ctx }) => {
    const row = await ctx.db
      .select({ value: systemConfig.value })
      .from(systemConfig)
      .where(eq(systemConfig.key, FRONTEND_CONFIG_KEY))
      .limit(1);
    return (row[0]?.value ?? {}) as Record<string, unknown>;
  }),

  saveFrontendConfig: adminProcedure
    .input(z.record(z.string(), z.any()))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .insert(systemConfig)
        .values({ key: FRONTEND_CONFIG_KEY, value: input })
        .onConflictDoUpdate({
          target: systemConfig.key,
          set: { value: input, updatedAt: new Date() },
        });
      return input;
    }),
});
