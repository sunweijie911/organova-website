import { eq } from 'drizzle-orm';
import type { MetadataRoute } from 'next';
import { db } from '@/server/db';
import { cancerTypes, caseStudies } from '@/server/db/schema';

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

  const [cases, cancers] = await Promise.all([
    db
      .select({ slug: caseStudies.slug, updatedAt: caseStudies.updatedAt })
      .from(caseStudies)
      .where(eq(caseStudies.isPublished, true)),
    db
      .select({ slug: cancerTypes.slug, updatedAt: cancerTypes.updatedAt })
      .from(cancerTypes)
      .where(eq(cancerTypes.isPublished, true)),
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

  return [...staticEntries, ...caseStudyEntries, ...cancerTypeEntries];
}
