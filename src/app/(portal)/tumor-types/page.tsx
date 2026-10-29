import type { Metadata } from 'next';
import { api, HydrateClient } from '@/lib/trpc/server';
import TumorTypesListView from '.';

export const metadata: Metadata = {
  title: 'Tumor Types',
  description:
    "Browse Organova's cancer type library covering 30+ tumor types — including lung, colorectal, breast, liver, and rare cancers — with validated PDO models.",
};

export default async function TumorTypesListPage() {
  await Promise.all([api.cancerTypes.list.prefetch()]);
  return (
    <HydrateClient>
      <TumorTypesListView />
    </HydrateClient>
  );
}
