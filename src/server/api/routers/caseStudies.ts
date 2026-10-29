import { TRPCError } from '@trpc/server';
import { and, asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import type { db as Db } from '@/server/db';
import { caseStudies, systemConfig } from '@/server/db/schema';
import { assertUpdated, isUniqueViolation } from '@/server/db/utils';
import { deleteFileIfChanged } from '@/server/services/storage';
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
  summary: z.string().max(1000).nullish(),
  coverImage: z.string().nullable().optional(),
  cancerTypeTags: z.array(z.string().max(64)).max(50).default([]),
  applicationTags: z.array(z.string().max(64)).max(50).default([]),
  challenge: z.string().max(50_000).nullish(),
  approach: z.string().max(50_000).nullish(),
  results: z.string().max(50_000).nullish(),
  implication: z.string().max(50_000).nullish(),
  metaModel: z.string().max(256).nullish(),
  metaDrugClasses: z.string().max(256).nullish(),
  metaReadout: z.string().max(256).nullish(),
  metaValidation: z.string().max(256).nullish(),
  cta1Label: z.string().max(128).nullish(),
  cta1Url: z.string().max(512).nullish(),
  cta2Label: z.string().max(128).nullish(),
  cta2Url: z.string().max(512).nullish(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const caseStudiesRouter = createTRPCRouter({
  // 门户：返回全部已发布案例；筛选逻辑在前端组件层进行（数据量有限）
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.isPublished, true))
      .orderBy(asc(caseStudies.sortOrder), desc(caseStudies.createdAt));
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
      try {
        const [row] = await ctx.db
          .insert(caseStudies)
          .values(input)
          .returning({ id: caseStudies.id });
        return row;
      } catch (err) {
        if (isUniqueViolation(err)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Slug "${input.slug}" 已存在`,
          });
        }
        throw err;
      }
    }),

  adminUpdate: adminProcedure
    .input(z.object({ id: z.number().int() }).merge(caseStudyWriteSchema))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const [before] = await ctx.db
        .select({ coverImage: caseStudies.coverImage })
        .from(caseStudies)
        .where(eq(caseStudies.id, id))
        .limit(1);
      let result: { id: number }[];
      try {
        result = await ctx.db
          .update(caseStudies)
          .set(data)
          .where(eq(caseStudies.id, id))
          .returning({ id: caseStudies.id });
      } catch (err) {
        if (isUniqueViolation(err)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `Slug "${data.slug}" 已被其他记录使用`,
          });
        }
        throw err;
      }
      assertUpdated(result);
      deleteFileIfChanged(before?.coverImage, data.coverImage);
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const [before] = await ctx.db
        .select({ coverImage: caseStudies.coverImage })
        .from(caseStudies)
        .where(eq(caseStudies.id, input.id))
        .limit(1);
      const result = await ctx.db
        .delete(caseStudies)
        .where(eq(caseStudies.id, input.id))
        .returning({ id: caseStudies.id });
      assertUpdated(result);
      deleteFileIfChanged(before?.coverImage, null);
      return { success: true };
    }),

  adminTogglePublish: adminProcedure
    .input(z.object({ id: z.number().int(), isPublished: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(caseStudies)
        .set({ isPublished: input.isPublished })
        .where(eq(caseStudies.id, input.id))
        .returning({ id: caseStudies.id });
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
        cancerTypeTags: z.array(z.string().max(64)).max(50).optional(),
        applicationTags: z.array(z.string().max(64)).max(50).optional(),
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
