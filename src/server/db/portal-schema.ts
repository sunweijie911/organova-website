import { index, integer, serial } from 'drizzle-orm/pg-core';
import type {
  LeadSource,
  LeadStatus,
  ResourceCtaType,
  TeamGroup,
} from '@/types/enums';
import { user } from './auth-schema';
import { createTable } from './table-creator';

// 统一线索表（contact 表单 + request-quote 表单）
export const leads = createTable(
  'lead',
  (d) => ({
    id: serial('id').primaryKey(),
    source: d.varchar({ length: 32 }).$type<LeadSource>().notNull(),
    status: d
      .varchar({ length: 32 })
      .$type<LeadStatus>()
      .notNull()
      .default('new'),
    // 共同字段
    firstName: d.varchar('first_name', { length: 128 }).notNull(),
    lastName: d.varchar('last_name', { length: 128 }).notNull(),
    email: d.varchar({ length: 512 }).notNull(),
    company: d.varchar({ length: 256 }),
    jobTitle: d.varchar('job_title', { length: 256 }),
    // contact 专有
    message: d.text(),
    // rfq 专有 - Step 1
    cancerType: d.varchar('cancer_type', { length: 256 }),
    drugModality: d.varchar('drug_modality', { length: 128 }),
    studyType: d.varchar('study_type', { length: 128 }),
    numCompounds: d.varchar('num_compounds', { length: 32 }),
    turnaround: d.varchar({ length: 64 }),
    // rfq 专有 - Step 2
    phone: d.varchar({ length: 64 }),
    ip: d.text(),
    // 通知邮件发送状态：pending（待发送）/ sent（已发送）/ failed（发送失败）
    // 用于运营在 admin/leads 列表看到 email 是否成功通知，失败时可手动补发或排查。
    emailSendStatus: d
      .varchar('email_send_status', { length: 16 })
      .notNull()
      .default('pending'),
    emailError: d.text('email_error'),
    emailSentAt: d.timestamp('email_sent_at', { withTimezone: true }),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('lead_source_idx').on(t.source),
    index('lead_status_idx').on(t.status),
    index('lead_created_at_idx').on(t.createdAt),
    index('lead_email_send_status_idx').on(t.emailSendStatus),
  ],
);

// 案例研究
export const caseStudies = createTable(
  'case_study',
  (d) => ({
    id: serial('id').primaryKey(),
    slug: d.varchar({ length: 256 }).notNull().unique(),
    title: d.varchar({ length: 512 }).notNull(),
    summary: d.text(), // 卡片一行摘要
    coverImage: d.text('cover_image'),
    cancerTypeTags: d.text('cancer_type_tags').array().notNull().default([]),
    applicationTags: d.text('application_tags').array().notNull().default([]),
    challenge: d.text(), // 富文本 HTML
    approach: d.text(), // 富文本 HTML
    results: d.text(), // 富文本 HTML
    implication: d.text(), // 富文本 HTML
    metaModel: d.text('meta_model'),
    metaDrugClasses: d.text('meta_drug_classes'),
    metaReadout: d.text('meta_readout'),
    metaValidation: d.text('meta_validation'),
    cta1Label: d.varchar('cta1_label', { length: 128 }),
    cta1Url: d.varchar('cta1_url', { length: 512 }),
    cta2Label: d.varchar('cta2_label', { length: 128 }),
    cta2Url: d.varchar('cta2_url', { length: 512 }),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: d.boolean('is_published').notNull().default(false),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('case_study_slug_idx').on(t.slug),
    index('case_study_published_idx').on(t.isPublished),
    index('case_study_sort_idx').on(t.sortOrder),
  ],
);

// 学术出版物
export const publications = createTable(
  'publication',
  (d) => ({
    id: serial('id').primaryKey(),
    year: integer('year').notNull(),
    journal: d.varchar({ length: 256 }).notNull(),
    title: d.text().notNull(),
    authors: d.varchar({ length: 512 }).notNull(),
    citationCount: d.varchar('citation_count', { length: 64 }), // "1,400+" 或 "—"
    doi: d.varchar({ length: 256 }),
    sortOrder: integer('sort_order').notNull().default(0),
    isVisible: d.boolean('is_visible').notNull().default(true),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('publication_year_idx').on(t.year),
    index('publication_sort_idx').on(t.sortOrder),
  ],
);

// 新闻
export const news = createTable(
  'news',
  (d) => ({
    id: serial('id').primaryKey(),
    title: d.varchar({ length: 512 }).notNull(),
    publishedAt: d.timestamp('published_at', { withTimezone: true }).notNull(),
    location: d.varchar({ length: 256 }), // "PHILADELPHIA, Penn."
    content: d.text(), // 富文本 HTML
    coverImage: d.text('cover_image'),
    isPublished: d.boolean('is_published').notNull().default(false),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('news_published_at_idx').on(t.publishedAt),
    index('news_is_published_idx').on(t.isPublished),
  ],
);

// 资源下载（固定3条）
export const resources = createTable(
  'resource',
  (d) => ({
    id: serial('id').primaryKey(),
    name: d.varchar({ length: 256 }).notNull(), // "Platform Overview"
    description: d.text(),
    ctaLabel: d.varchar('cta_label', { length: 128 }), // "Download PDF →"
    ctaType: d
      .varchar('cta_type', { length: 32 })
      .$type<ResourceCtaType>()
      .notNull()
      .default('download'),
    fileUrl: d.text('file_url'), // PDF 文件 URL
    externalUrl: d.text('external_url'),
    isVisible: d.boolean('is_visible').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [index('resource_sort_idx').on(t.sortOrder)],
);

// FAQ 分类
export const faqCategories = createTable(
  'faq_category',
  (d) => ({
    id: serial('id').primaryKey(),
    name: d.varchar({ length: 256 }).notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    isVisible: d.boolean('is_visible').notNull().default(true),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [index('faq_category_sort_idx').on(t.sortOrder)],
);

// FAQ 条目
export const faqItems = createTable(
  'faq_item',
  (d) => ({
    id: serial('id').primaryKey(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => faqCategories.id, { onDelete: 'cascade' }),
    question: d.text().notNull(),
    answer: d.text().notNull(), // 富文本 HTML
    sortOrder: integer('sort_order').notNull().default(0),
    isVisible: d.boolean('is_visible').notNull().default(true),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('faq_item_category_idx').on(t.categoryId),
    index('faq_item_sort_idx').on(t.sortOrder),
  ],
);

// 团队成员
export const teamMembers = createTable(
  'team_member',
  (d) => ({
    id: serial('id').primaryKey(),
    photo: d.text(),
    name: d.varchar({ length: 256 }).notNull(), // "Wei He, PhD"
    title: d.varchar({ length: 256 }).notNull(), // "Co-Founder & CSO"
    shortBio: d.text('short_bio'), // 卡片显示文字
    fullBio: d.text('full_bio'), // 富文本 HTML，点击展开
    group: d
      .varchar({ length: 32 })
      .$type<TeamGroup>()
      .notNull()
      .default('tricbio'),
    sortOrder: integer('sort_order').notNull().default(0),
    isVisible: d.boolean('is_visible').notNull().default(true),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('team_member_group_idx').on(t.group),
    index('team_member_sort_idx').on(t.sortOrder),
  ],
);

// 癌种库
export const cancerTypes = createTable(
  'cancer_type',
  (d) => ({
    id: serial('id').primaryKey(),
    name: d.varchar({ length: 256 }).notNull(), // "Liver Cancer (HCC / ICC)"
    slug: d.varchar({ length: 256 }).notNull().unique(), // "liver-cancer"
    modelCount: d.varchar('model_count', { length: 64 }), // "400+ (China)"
    formats: d.varchar({ length: 128 }), // "PDO 1.0 & 2.0"
    coverImage: d.text('cover_image'),
    // 子页详情
    subpageTitle: d.varchar('subpage_title', { length: 512 }),
    modelCountDetail: d.text('model_count_detail'),
    validationMethods: d.text('validation_methods'),
    validatedApplications: d.text('validated_applications'), // 富文本 HTML
    clinicalCorrelation: d.text('clinical_correlation'),
    cta1Label: d.varchar('cta1_label', { length: 128 }),
    cta1Url: d.varchar('cta1_url', { length: 512 }),
    cta2Label: d.varchar('cta2_label', { length: 128 }),
    cta2Url: d.varchar('cta2_url', { length: 512 }),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: d.boolean('is_published').notNull().default(false),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('cancer_type_slug_idx').on(t.slug),
    index('cancer_type_published_idx').on(t.isPublished),
    index('cancer_type_sort_idx').on(t.sortOrder),
  ],
);

export const userProfiles = createTable('user_profile', (d) => ({
  userId: d
    .text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  displayName: d.varchar('display_name', { length: 256 }),
  avatar: d.text(),
  bio: d.text(),
  updatedAt: d
    .timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date()),
}));
