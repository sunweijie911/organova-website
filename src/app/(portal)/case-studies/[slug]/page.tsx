import { TRPCError } from '@trpc/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { api } from '@/lib/trpc/server';
import DetailBody from './detail-body';
import DetailHero from './detail-hero';

// React cache 让 generateMetadata 和页面渲染共享同一次查询结果。
const getCaseStudy = cache(async (slug: string) => {
  try {
    return await api.caseStudies.getBySlug({ slug });
  } catch (err) {
    if (err instanceof TRPCError && err.code === 'NOT_FOUND') return null;
    throw err;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getCaseStudy(slug);
  if (!row) return { title: 'Case Study' };
  return {
    title: row.title,
    description: row.summary ?? undefined,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCaseStudy(slug);
  if (!data) notFound();

  return (
    <>
      <DetailHero
        applicationTags={data.applicationTags}
        cancerTypeTags={data.cancerTypeTags}
        summary={data.summary}
        title={data.title}
      />
      <DetailBody
        approach={data.approach}
        challenge={data.challenge}
        cta1Label={data.cta1Label}
        cta1Url={data.cta1Url}
        cta2Label={data.cta2Label}
        cta2Url={data.cta2Url}
        implication={data.implication}
        metaDrugClasses={data.metaDrugClasses}
        metaModel={data.metaModel}
        metaReadout={data.metaReadout}
        metaValidation={data.metaValidation}
        results={data.results}
      />
    </>
  );
}
