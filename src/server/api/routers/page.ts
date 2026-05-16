import { eq } from 'drizzle-orm';
import { frontendConfigSchema } from '@/constants/frontend-config';
import {
  buildFrontendConfigZod,
  type FrontendConfig,
} from '@/lib/frontend-config';
import { systemConfig } from '@/server/db/schema';
import { adminProcedure, createTRPCRouter } from '../trpc';

const FRONTEND_CONFIG_KEY = 'frontend';
const frontendConfigInput = buildFrontendConfigZod(frontendConfigSchema);

export const pageRouter = createTRPCRouter({
  getFrontendConfig: adminProcedure.query(async ({ ctx }) => {
    const row = await ctx.db
      .select({ value: systemConfig.value })
      .from(systemConfig)
      .where(eq(systemConfig.key, FRONTEND_CONFIG_KEY))
      .limit(1);
    return (row[0]?.value ?? {}) as Partial<FrontendConfig>;
  }),

  saveFrontendConfig: adminProcedure
    .input(frontendConfigInput)
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
