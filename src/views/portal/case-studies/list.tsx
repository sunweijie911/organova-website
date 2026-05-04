'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import styles from './list.module.scss';

export default function CaseStudiesListView() {
  const [cancerType, setCancerType] = useState('All');
  const [application, setApplication] = useState('All');

  const { data: options } = api.caseStudies.filterOptions.useQuery();
  const { data, isLoading } = api.caseStudies.list.useQuery({
    cancerType,
    application,
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            From Biological Question to Clinical Insight.
          </h1>
          <p className={styles.heroSubtitle}>
            Explore real-world examples of how our platform is helping partners
            overcome their toughest preclinical challenges.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          {/* Filters */}
          {options && (
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Cancer Type</span>
                <div className={styles.filterPills}>
                  {options.cancerTypes.map((t) => (
                    <button
                      className={`${styles.pill} ${cancerType === t ? styles.pillActive : ''}`}
                      key={t}
                      onClick={() => setCancerType(t)}
                      type="button"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Application</span>
                <div className={styles.filterPills}>
                  {options.applications.map((a) => (
                    <button
                      className={`${styles.pill} ${application === a ? styles.pillActive : ''}`}
                      key={a}
                      onClick={() => setApplication(a)}
                      type="button"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          {isLoading && <div className={styles.loading}>Loading...</div>}
          <div className={styles.grid}>
            {data?.map((cs) => (
              <Link
                className={styles.card}
                href={`/case-studies/${cs.slug}`}
                key={cs.id}
              >
                {cs.coverImage && (
                  // biome-ignore lint/performance/noImgElement: dynamic user image
                  <img
                    alt={cs.title}
                    className={styles.cardImg}
                    src={cs.coverImage}
                  />
                )}
                <div className={styles.cardBody}>
                  <div className={styles.cardTags}>
                    {cs.cancerTypeTags.slice(0, 2).map((t) => (
                      <span className={styles.tag} key={t}>
                        {t}
                      </span>
                    ))}
                    {cs.applicationTags.slice(0, 1).map((t) => (
                      <span
                        className={`${styles.tag} ${styles.tagApp}`}
                        key={t}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className={styles.cardTitle}>{cs.title}</h3>
                  {cs.summary && (
                    <p className={styles.cardSummary}>{cs.summary}</p>
                  )}
                  <span className={styles.cardLink}>Read Case Study →</span>
                </div>
              </Link>
            ))}
          </div>
          {!isLoading && data?.length === 0 && (
            <div className={styles.empty}>
              No case studies match the selected filters.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
