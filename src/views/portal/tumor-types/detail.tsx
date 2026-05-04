'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/trpc/react';
import styles from './detail.module.scss';

export default function TumorTypeDetailView() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = api.cancerTypes.getBySlug.useQuery({
    slug: params.slug,
  });

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!data)
    return (
      <div className={styles.notFound}>
        Not found. <Link href="/tumor-types">← Back</Link>
      </div>
    );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBack}>
          <Link className={styles.backLink} href="/tumor-types">
            ← All Tumor Types
          </Link>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{data.subpageTitle ?? data.name}</h1>
          {data.modelCount && (
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{data.modelCount}</span>
              <span className={styles.heroStatLabel}>Models Available</span>
            </div>
          )}
          {data.formats && <p className={styles.heroFormats}>{data.formats}</p>}
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            {data.modelCountDetail && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>
                  Model Count & Availability
                </h2>
                <p className={styles.bodyText}>{data.modelCountDetail}</p>
              </div>
            )}
            {data.validationMethods && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Validation Methods</h2>
                <p className={styles.bodyText}>{data.validationMethods}</p>
              </div>
            )}
            {data.validatedApplications && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Validated Applications</h2>
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{
                    __html: data.validatedApplications,
                  }}
                />
              </div>
            )}
            {data.clinicalCorrelation && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Clinical Correlation</h2>
                <p className={styles.bodyText}>{data.clinicalCorrelation}</p>
              </div>
            )}
          </div>

          <aside className={styles.sidebar}>
            {(data.cta1Label || data.cta2Label) && (
              <div className={styles.ctaBox}>
                {data.cta1Label && data.cta1Url && (
                  <Link className={styles.ctaBtn} href={data.cta1Url}>
                    {data.cta1Label}
                  </Link>
                )}
                {data.cta2Label && data.cta2Url && (
                  <Link className={styles.ctaBtnSecondary} href={data.cta2Url}>
                    {data.cta2Label}
                  </Link>
                )}
              </div>
            )}
            <div className={styles.requestBox}>
              <p>Need access to these models?</p>
              <Link href="/request-quote">Request a Quote →</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
