import { TRPCError } from '@trpc/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';
import { leads } from '@/server/db/schema';
import { sendLeadNotification } from '@/server/services/email';
import { getClientIp } from '@/server/services/get-client-ip';
import { contactLimiter } from '@/server/services/rate-limiter';
import { LEAD_SOURCES, LEAD_STATUSES } from '@/types/enums';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const contactSubmitSchema = z.object({
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  email: z.email().max(512),
  company: z.string().max(256).optional(),
  jobTitle: z.string().max(256).optional(),
  message: z.string().min(1).max(5000),
});

const rfqSubmitSchema = z.object({
  cancerType: z.string().trim().min(1).max(256),
  drugModality: z.string().trim().min(1).max(128),
  studyType: z.string().trim().min(1).max(128),
  numCompounds: z.string().trim().min(1).max(32),
  turnaround: z.string().trim().min(1).max(64),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  email: z.email().max(512),
  company: z.string().min(1).max(256),
  jobTitle: z.string().max(256).optional(),
  phone: z.string().max(64).optional(),
});

function buildWhere(input: {
  search?: string;
  source?: (typeof LEAD_SOURCES)[number];
  status?: (typeof LEAD_STATUSES)[number];
}) {
  const conditions = [];
  if (input.source) conditions.push(eq(leads.source, input.source));
  if (input.status) conditions.push(eq(leads.status, input.status));
  if (input.search) {
    conditions.push(
      or(
        ilike(leads.firstName, `%${input.search}%`),
        ilike(leads.lastName, `%${input.search}%`),
        ilike(leads.email, `%${input.search}%`),
        ilike(leads.company, `%${input.search}%`),
      ),
    );
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

export const leadsRouter = createTRPCRouter({
  submitContact: publicProcedure
    .input(contactSubmitSchema)
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.headers);
      const { allowed, retryAfterMs } = contactLimiter.check(`contact:${ip}`);
      if (!allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `请求过于频繁，请 ${Math.ceil(retryAfterMs / 1000)} 秒后重试`,
        });
      }
      await ctx.db.insert(leads).values({ ...input, source: 'contact', ip });
      // 异步发送通知邮件，不阻塞响应
      void sendLeadNotification({ source: 'contact', ...input });
      return { success: true };
    }),

  submitRfq: publicProcedure
    .input(rfqSubmitSchema)
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.headers);
      const { allowed, retryAfterMs } = contactLimiter.check(`rfq:${ip}`);
      if (!allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `请求过于频繁，请 ${Math.ceil(retryAfterMs / 1000)} 秒后重试`,
        });
      }
      await ctx.db.insert(leads).values({ ...input, source: 'rfq', ip });
      void sendLeadNotification({ source: 'rfq', ...input });
      return { success: true };
    }),

  // 后台接口
  adminList: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
        source: z.enum(LEAD_SOURCES).optional(),
        status: z.enum(LEAD_STATUSES).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;
      const where = buildWhere(input);

      const [rows, countRows] = await Promise.all([
        ctx.db
          .select()
          .from(leads)
          .where(where)
          .orderBy(desc(leads.createdAt))
          .limit(pageSize)
          .offset(offset),
        ctx.db.$count(leads, where),
      ]);

      return { items: rows, total: countRows, page, pageSize };
    }),

  // CSV 导出（单次最多 1000 条；超量需配合分批接口或筛选缩量）
  adminExportAll: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        source: z.enum(LEAD_SOURCES).optional(),
        status: z.enum(LEAD_STATUSES).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const where = buildWhere(input);
      return ctx.db
        .select()
        .from(leads)
        .where(where)
        .orderBy(desc(leads.createdAt))
        .limit(1000);
    }),

  adminGet: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(leads)
        .where(eq(leads.id, input.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminUpdateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        status: z.enum(LEAD_STATUSES),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(leads)
        .set({ status: input.status })
        .where(eq(leads.id, input.id))
        .returning({ id: leads.id });
      if (result.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return { success: true };
    }),
});
