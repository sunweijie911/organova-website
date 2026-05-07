import type { Metadata } from 'next';
import { Suspense } from 'react';
import PublicationsView from './index';

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Peer-reviewed publications and research papers demonstrating the clinical and scientific validation of the Organova patient-derived organoid platform.',
};

export default function PublicationsPage() {
  return (
    <Suspense>
      <PublicationsView />
    </Suspense>
  );
}
