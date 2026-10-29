import { TRPCError } from '@trpc/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { after } from 'next/server';
import { z } from 'zod';
import type { db as Db } from '@/server/db';
import { leads } from '@/server/db/schema';
import {
  type LeadNotificationPayload,
  sendLeadNotification,
} from '@/server/services/email';
import { getClientIp } from '@/server/services/get-client-ip';
import { contactLimiter } from '@/server/services/rate-limiter';
import { LEAD_SOURCES, LEAD_STATUSES } from '@/types/enums';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

// 发送通知邮件并回写发送状态。邮件失败不抛错，避免影响用户提交体验。
async function sendLeadAndRecordStatus(
  db: typeof Db,
  leadId: number | undefined,
  payload: LeadNotificationPayload,
) {
  try {
    await sendLeadNotification(payload);
    if (leadId) {
      await db
        .update(leads)
        .set({ emailSendStatus: 'sent', emailSentAt: new Date() })
        .where(eq(leads.id, leadId));
    }
  } catch (err) {
    console.error('[leads] sendLeadNotification failed:', err);
    if (leadId) {
      const msg = err instanceof Error ? err.message : String(err);
      await db
        .update(leads)
        .set({
          emailSendStatus: 'failed',
          emailError: msg.slice(0, 2000),
        })
        .where(eq(leads.id, leadId));
    }
  }
}

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
      // contact 和 rfq 共用同一限流桶（lead:），防止攻击者通过分别打两个端点叠加配额
      const { allowed, retryAfterMs } = await contactLimiter.check(
        `lead:${ip}`,
      );
      if (!allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `请求过于频繁，请 ${Math.ceil(retryAfterMs / 1000)} 秒后重试`,
        });
      }
      const [row] = await ctx.db
        .insert(leads)
        .values({ ...input, source: 'contact', ip })
        .returning({ id: leads.id });
      // 响应返回后再发信，SMTP 慢或失败不阻塞表单；通过 email_send_status 留痕，admin 可补救
      after(() =>
        sendLeadAndRecordStatus(ctx.db, row?.id, {
          source: 'contact',
          ...input,
        }),
      );
      return { success: true };
    }),

  submitRfq: publicProcedure
    .input(rfqSubmitSchema)
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.headers);
      const { allowed, retryAfterMs } = await contactLimiter.check(
        `lead:${ip}`,
      );
      if (!allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `请求过于频繁，请 ${Math.ceil(retryAfterMs / 1000)} 秒后重试`,
        });
      }
      const [row] = await ctx.db
        .insert(leads)
        .values({ ...input, source: 'rfq', ip })
        .returning({ id: leads.id });
      after(() =>
        sendLeadAndRecordStatus(ctx.db, row?.id, {
          source: 'rfq',
          ...input,
        }),
      );
      return { success: true };
    }),

  // 后台接口
  adminList: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        search: z.string().max(256).optional(),
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
  // 改为 mutation 以走 auditMiddleware 留痕（导出敏感数据必须可审计）
  adminExportAll: adminProcedure
    .input(
      z.object({
        search: z.string().max(256).optional(),
        source: z.enum(LEAD_SOURCES).optional(),
        status: z.enum(LEAD_STATUSES).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
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
