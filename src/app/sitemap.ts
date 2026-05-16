import type { MetadataRoute } from 'next';
import { env } from '@/env';
import { api } from '@/lib/trpc/server';

const BASE_URL = env.BETTER_AUTH_URL ?? 'http://localhost:3000';

const STATIC_PATHS = [
  { path: '', priority: 1.0 },
  { path: '/about', priority: 0.8 },
  { path: '/platform', priority: 0.8 },
  { path: '/immuno-oncology', priority: 0.8 },
  { path: '/pharma-solutions', priority: 0.8 },
  { path: '/biotech-partnerships', priority: 0.8 },
  { path: '/tumor-types', priority: 0.8 },
  { path: '/case-studies', priority: 0.8 },
  { path: '/publications', priority: 0.7 },
  { path: '/faq', priority: 0.5 },
  { path: '/contact', priority: 0.5 },
  { path: '/request-quote', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
    ({ path, priority }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
    }),
  );

  // 数据库不可用时降级为空列表，避免 CI/构建阶段崩溃；
  // 仍记 warn 日志，避免生产返回不完整 sitemap 长期被忽略。
  const [cases, cancers, newsItems] = await Promise.all([
    api.caseStudies.list().catch((err) => {
      console.warn('[sitemap] caseStudies 查询失败，已降级为空', err);
      return [];
    }),
    api.cancerTypes.list().catch((err) => {
      console.warn('[sitemap] cancerTypes 查询失败，已降级为空', err);
      return [];
    }),
    api.news.list({}).catch((err) => {
      console.warn('[sitemap] news 查询失败，已降级为空', err);
      return [];
    }),
  ]);

  const caseStudyEntries: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${BASE_URL}/case-studies/${c.slug}`,
    lastModified: c.updatedAt ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const cancerTypeEntries: MetadataRoute.Sitemap = cancers.map((c) => ({
    url: `${BASE_URL}/tumor-types/${c.slug}`,
    lastModified: c.updatedAt ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const newsEntries: MetadataRoute.Sitemap = newsItems.map((n) => ({
    url: `${BASE_URL}/news/${n.id}`,
    lastModified: n.updatedAt ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...caseStudyEntries,
    ...cancerTypeEntries,
    ...newsEntries,
  ];
}
