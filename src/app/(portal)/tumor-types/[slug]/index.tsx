'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/trpc/react';
import DetailContent from './detail-content';
import styles from './index.module.scss';

export default function TumorTypeDetailView() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = api.cancerTypes.getBySlug.useQuery({
    slug: params.slug,
  });

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!data)
    return (
      <div className={styles.notFound}>
        Not found. <Link href="/tumor-types">← Back to Catalog</Link>
      </div>
    );

  return <DetailContent data={data} />;
}
