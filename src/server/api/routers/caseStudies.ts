import { TRPCError } from '@trpc/server';
import { and, asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import type { db as Db } from '@/server/db';
import { caseStudies, systemConfig } from '@/server/db/schema';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const DEFAULT_CANCER_TYPE_TAGS = [
  'HCC/ICC',
  'CRC',
  'NSCLC',
  'Gastric',
  'Breast',
  'RCC',
  'GBM',
  'GIST',
  'Rare Tumors',
  'Non-Oncology',
];

const DEFAULT_APPLICATION_TAGS = [
  'Drug Efficacy',
  'Immunotherapy',
  'ADC',
  'Target Discovery',
  'Safety & Toxicity',
  'Disease Modeling',
  'Special Models',
];

const CANCER_TAGS_KEY = 'case_study_cancer_tags';
const APP_TAGS_KEY = 'case_study_application_tags';

// 从 systemConfig 加载筛选标签，缺失或类型错误时回退到默认值
async function loadFilterTags(db: typeof Db) {
  const [cancerRow, appRow] = await Promise.all([
    db.query.systemConfig.findFirst({
      where: eq(systemConfig.key, CANCER_TAGS_KEY),
    }),
    db.query.systemConfig.findFirst({
      where: eq(systemConfig.key, APP_TAGS_KEY),
    }),
  ]);
  const parseTags = (
    row: { value: unknown } | undefined,
    defaults: string[],
  ) => {
    const val = row?.value;
    return Array.isArray(val) && val.every((v) => typeof v === 'string')
      ? (val as string[])
      : defaults;
  };
  return {
    cancerTags: parseTags(cancerRow, DEFAULT_CANCER_TYPE_TAGS),
    appTags: parseTags(appRow, DEFAULT_APPLICATION_TAGS),
  };
}

const caseStudyWriteSchema = z.object({
  slug: z.string().min(1).max(256),
  title: z.string().min(1).max(512),
  summary: z.string().max(1000).optional(),
  coverImage: z.string().optional(),
  cancerTypeTags: z.array(z.string()).default([]),
  applicationTags: z.array(z.string()).default([]),
  challenge: z.string().optional(),
  approach: z.string().optional(),
  results: z.string().optional(),
  implication: z.string().optional(),
  metaModel: z.string().max(256).optional(),
  metaDrugClasses: z.string().max(256).optional(),
  metaReadout: z.string().max(256).optional(),
  metaValidation: z.string().max(256).optional(),
  cta1Label: z.string().max(128).optional(),
  cta1Url: z.string().max(512).optional(),
  cta2Label: z.string().max(128).optional(),
  cta2Url: z.string().max(512).optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const caseStudiesRouter = createTRPCRouter({
  // 门户：获取已发布列表（含筛选）
  list: publicProcedure
    .input(
      z.object({
        cancerType: z.string().optional(),
        application: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const rows = await ctx.db
        .select()
        .from(caseStudies)
        .where(eq(caseStudies.isPublished, true))
        .orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));

      // 前端筛选逻辑（数据量有限，在内存过滤）
      return rows.filter((r) => {
        if (
          input.cancerType &&
          input.cancerType !== 'All' &&
          !r.cancerTypeTags.includes(input.cancerType)
        )
          return false;
        if (
          input.application &&
          input.application !== 'All' &&
          !r.applicationTags.includes(input.application)
        )
          return false;
        return true;
      });
    }),

  // 门户：按 slug 获取详情
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(caseStudies)
        .where(
          and(
            eq(caseStudies.slug, input.slug),
            eq(caseStudies.isPublished, true),
          ),
        )
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  // 后台：全量列表
  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(caseStudies)
      .orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));
  }),

  adminGet: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(caseStudies)
        .where(eq(caseStudies.id, input.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminCreate: adminProcedure
    .input(caseStudyWriteSchema)
    .mutation(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .insert(caseStudies)
        .values(input)
        .returning({ id: caseStudies.id });
      return row;
    }),

  adminUpdate: adminProcedure
    .input(z.object({ id: z.number().int() }).merge(caseStudyWriteSchema))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      await ctx.db.update(caseStudies).set(data).where(eq(caseStudies.id, id));
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(caseStudies).where(eq(caseStudies.id, input.id));
      return { success: true };
    }),

  adminTogglePublish: adminProcedure
    .input(z.object({ id: z.number().int(), isPublished: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(caseStudies)
        .set({ isPublished: input.isPublished })
        .where(eq(caseStudies.id, input.id));
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
            .update(caseStudies)
            .set({ sortOrder })
            .where(eq(caseStudies.id, id));
        }
      });
      return { success: true };
    }),

  filterOptions: publicProcedure.query(async ({ ctx }) => {
    const { cancerTags, appTags } = await loadFilterTags(ctx.db);
    return {
      cancerTypes: ['All', ...cancerTags],
      applications: ['All', ...appTags],
    };
  }),

  adminGetFilterTags: adminProcedure.query(async ({ ctx }) => {
    const { cancerTags, appTags } = await loadFilterTags(ctx.db);
    return {
      cancerTypeTags: cancerTags,
      applicationTags: appTags,
    };
  }),

  adminSetFilterTags: adminProcedure
    .input(
      z.object({
        cancerTypeTags: z.array(z.string()).optional(),
        applicationTags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const ops = [];
      if (input.cancerTypeTags) {
        ops.push(
          ctx.db
            .insert(systemConfig)
            .values({ key: CANCER_TAGS_KEY, value: input.cancerTypeTags })
            .onConflictDoUpdate({
              target: systemConfig.key,
              set: { value: input.cancerTypeTags },
            }),
        );
      }
      if (input.applicationTags) {
        ops.push(
          ctx.db
            .insert(systemConfig)
            .values({ key: APP_TAGS_KEY, value: input.applicationTags })
            .onConflictDoUpdate({
              target: systemConfig.key,
              set: { value: input.applicationTags },
            }),
        );
      }
      await Promise.all(ops);
      return { success: true };
    }),
});
