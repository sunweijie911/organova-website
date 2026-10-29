import type { Metadata } from 'next';
import { Suspense } from 'react';
import { api, HydrateClient } from '@/lib/trpc/server';
import PublicationsView from './index';

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Peer-reviewed publications and research papers demonstrating the clinical and scientific validation of the Organova patient-derived organoid platform.',
};

// 视图按 ?tab= 切换，页面按请求渲染
export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  await Promise.all([
    api.publications.list.prefetch(),
    api.news.list.prefetch({}),
    api.news.availableYears.prefetch(),
    api.resources.list.prefetch(),
  ]);
  return (
    <HydrateClient>
      <Suspense>
        <PublicationsView />
      </Suspense>
    </HydrateClient>
  );
}
