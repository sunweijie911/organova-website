'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/trpc/react';
import styles from './detail.module.scss';

export default function CaseStudyDetailView() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = api.caseStudies.getBySlug.useQuery({
    slug: params.id,
  });

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!data)
    return (
      <div className={styles.notFound}>
        Case study not found. <Link href="/case-studies">← Back</Link>
      </div>
    );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBack}>
          <Link className={styles.backLink} href="/case-studies">
            ← All Case Studies
          </Link>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroTags}>
            {data.cancerTypeTags.map((t) => (
              <span className={styles.tag} key={t}>
                {t}
              </span>
            ))}
            {data.applicationTags.map((t) => (
              <span className={`${styles.tag} ${styles.tagApp}`} key={t}>
                {t}
              </span>
            ))}
          </div>
          <h1 className={styles.heroTitle}>{data.title}</h1>
          {data.summary && <p className={styles.heroSummary}>{data.summary}</p>}
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            {data.challenge && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Challenge</h2>
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: data.challenge }}
                />
              </div>
            )}
            {data.approach && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Approach</h2>
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: data.approach }}
                />
              </div>
            )}
            {data.results && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Results</h2>
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: data.results }}
                />
              </div>
            )}
            {data.implication && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Implication</h2>
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: data.implication }}
                />
              </div>
            )}
          </div>

          {/* Sidebar metadata */}
          <aside className={styles.sidebar}>
            {(data.metaModel ||
              data.metaDrugClasses ||
              data.metaReadout ||
              data.metaValidation) && (
              <div className={styles.metaCard}>
                <h3 className={styles.metaTitle}>Study Details</h3>
                {data.metaModel && (
                  <div className={styles.metaItem}>
                    <span>Model</span>
                    <p>{data.metaModel}</p>
                  </div>
                )}
                {data.metaDrugClasses && (
                  <div className={styles.metaItem}>
                    <span>Drug Classes</span>
                    <p>{data.metaDrugClasses}</p>
                  </div>
                )}
                {data.metaReadout && (
                  <div className={styles.metaItem}>
                    <span>Readout</span>
                    <p>{data.metaReadout}</p>
                  </div>
                )}
                {data.metaValidation && (
                  <div className={styles.metaItem}>
                    <span>Validation</span>
                    <p>{data.metaValidation}</p>
                  </div>
                )}
              </div>
            )}

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
          </aside>
        </div>
      </section>
    </div>
  );
}
