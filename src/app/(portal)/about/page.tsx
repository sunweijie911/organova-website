import type { Metadata } from 'next';
import { api, HydrateClient } from '@/lib/trpc/server';
import AboutView from './index';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about the Organova team, our mission to advance precision oncology, and the science behind our patient-derived organoid platform.',
};

export default async function AboutPage() {
  await Promise.all([api.team.list.prefetch()]);
  return (
    <HydrateClient>
      <AboutView />
    </HydrateClient>
  );
}
