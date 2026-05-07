import { eq } from 'drizzle-orm';
import type { MetadataRoute } from 'next';
import { db } from '@/server/db';
import { cancerTypes, caseStudies, news } from '@/server/db/schema';

const BASE_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

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
  { path: '/faq', priority: 0.6 },
  { path: '/contact', priority: 0.6 },
  { path: '/request-quote', priority: 0.7 },
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
  // 但要记日志，否则生产长期返回不完整 sitemap 也无人察觉。
  const [cases, cancers, newsItems] = await Promise.all([
    db
      .select({ slug: caseStudies.slug, updatedAt: caseStudies.updatedAt })
      .from(caseStudies)
      .where(eq(caseStudies.isPublished, true))
      .catch((err) => {
        console.warn('[sitemap] caseStudies 查询失败，已降级为空', err);
        return [];
      }),
    db
      .select({ slug: cancerTypes.slug, updatedAt: cancerTypes.updatedAt })
      .from(cancerTypes)
      .where(eq(cancerTypes.isPublished, true))
      .catch((err) => {
        console.warn('[sitemap] cancerTypes 查询失败，已降级为空', err);
        return [];
      }),
    db
      .select({ id: news.id, updatedAt: news.updatedAt })
      .from(news)
      .where(eq(news.isPublished, true))
      .catch((err) => {
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
