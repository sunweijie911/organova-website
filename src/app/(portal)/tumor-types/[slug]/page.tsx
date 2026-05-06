import { and, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { db } from '@/server/db';
import { cancerTypes } from '@/server/db/schema';
import TumorTypeDetailView from '@/views/portal/tumor-types/detail';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [row] = await db
    .select({ name: cancerTypes.name, subpageTitle: cancerTypes.subpageTitle })
    .from(cancerTypes)
    .where(and(eq(cancerTypes.slug, slug), eq(cancerTypes.isPublished, true)))
    .limit(1);

  if (!row) return { title: 'Tumor Type' };

  return {
    title: row.name,
    description: row.subpageTitle ?? undefined,
  };
}

export default TumorTypeDetailView;
