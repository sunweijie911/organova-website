import type { Metadata } from 'next';
import { api, HydrateClient } from '@/lib/trpc/server';
import FaqView from './index';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    "Frequently asked questions about Organova's PDO platform, services, sample submission process, turnaround times, and data delivery.",
};

export default async function FaqPage() {
  await Promise.all([api.faq.listWithItems.prefetch()]);
  return (
    <HydrateClient>
      <FaqView />
    </HydrateClient>
  );
}
