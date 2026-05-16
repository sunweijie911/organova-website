import { TRPCError } from '@trpc/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { api } from '@/lib/trpc/server';
import DetailContent from './detail-content';

const getCancerType = cache(async (slug: string) => {
  try {
    return await api.cancerTypes.getBySlug({ slug });
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
  const row = await getCancerType(slug);
  if (!row) return { title: 'Tumor Type' };
  return {
    title: row.name,
    description: row.subpageTitle ?? undefined,
  };
}

export default async function TumorTypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCancerType(slug);
  if (!data) notFound();

  return <DetailContent data={data} />;
}
