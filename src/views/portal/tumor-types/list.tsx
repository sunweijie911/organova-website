'use client';

import Link from 'next/link';
import { api } from '@/lib/trpc/react';
import styles from './list.module.scss';

export default function TumorTypesListView() {
  const { data, isLoading } = api.cancerTypes.list.useQuery();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            The World's Largest Living Cancer Biobank.
          </h1>
          <p className={styles.heroSubtitle}>
            1,500+ deeply characterized patient-derived organoid models. 20+
            cancer types. Both PDO 1.0 and Organoid 2.0 (ALI-PDO™) formats
            available.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <h2 className={styles.introTitle}>
              Find the Right Model for Your Study
            </h2>
            <p className={styles.introSub}>
              All models are available in both PDO 1.0 and Organoid 2.0
              (ALI-PDO™) formats unless otherwise noted.
            </p>
          </div>

          {isLoading && <div className={styles.loading}>Loading...</div>}

          <div className={styles.grid}>
            {data?.map((ct) => (
              <Link
                className={styles.card}
                href={`/tumor-types/${ct.slug}`}
                key={ct.id}
              >
                {ct.coverImage && (
                  // biome-ignore lint/performance/noImgElement: dynamic user image
                  <img
                    alt={ct.name}
                    className={styles.cardImg}
                    src={ct.coverImage}
                  />
                )}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{ct.name}</h3>
                  {ct.modelCount && (
                    <p className={styles.cardCount}>{ct.modelCount}</p>
                  )}
                  {ct.formats && (
                    <span className={styles.cardFormat}>{ct.formats}</span>
                  )}
                  <span className={styles.cardLink}>Explore Models →</span>
                </div>
              </Link>
            ))}
          </div>

          {!isLoading && (!data || data.length === 0) && (
            <div className={styles.empty}>Cancer type catalog coming soon.</div>
          )}
        </div>
      </section>
    </div>
  );
}
