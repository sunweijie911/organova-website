import { and, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { db } from '@/server/db';
import { caseStudies } from '@/server/db/schema';
import CaseStudyDetailView from './detail';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [row] = await db
    .select({ title: caseStudies.title, summary: caseStudies.summary })
    .from(caseStudies)
    .where(and(eq(caseStudies.slug, slug), eq(caseStudies.isPublished, true)))
    .limit(1);

  if (!row) return { title: 'Case Study' };

  return {
    title: row.title,
    description: row.summary ?? undefined,
  };
}

export default CaseStudyDetailView;
