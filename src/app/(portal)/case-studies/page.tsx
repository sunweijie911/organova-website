import type { Metadata } from 'next';
import { api, HydrateClient } from '@/lib/trpc/server';
import CaseStudiesListView from '.';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Real-world examples of how Organova PDO models have been used to evaluate drug efficacy, identify resistance mechanisms, and guide clinical decisions.',
};

export default async function CaseStudiesListPage() {
  await Promise.all([
    api.caseStudies.filterOptions.prefetch(),
    api.caseStudies.list.prefetch(),
  ]);
  return (
    <HydrateClient>
      <CaseStudiesListView />
    </HydrateClient>
  );
}
