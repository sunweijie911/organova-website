import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { contactSubmissions } from '@/server/db/schema';
import { getClientIp } from '@/server/services/get-client-ip';
import { contactLimiter } from '@/server/services/rate-limiter';
import { createTRPCRouter, publicProcedure } from '../trpc';

const contactSchema = z.object({
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  email: z.string().email().max(512),
  company: z.string().max(256).optional(),
  jobTitle: z.string().max(256).optional(),
  message: z.string().min(1).max(5000),
});

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(contactSchema)
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.headers);

      const { allowed, retryAfterMs } = contactLimiter.check(`contact:${ip}`);
      if (!allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `请求过于频繁，请 ${Math.ceil(retryAfterMs / 1000)} 秒后重试`,
        });
      }

      await db.insert(contactSubmissions).values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        company: input.company,
        jobTitle: input.jobTitle,
        message: input.message,
        ip,
      });

      return { success: true };
    }),
});
