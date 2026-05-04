'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

export default function PublicationsView() {
  const [year, setYear] = useState<number | undefined>();

  const { data: pubs } = api.publications.list.useQuery();
  const { data: newsItems } = api.news.list.useQuery({ year });
  const { data: years } = api.news.availableYears.useQuery();
  const { data: resources } = api.resources.list.useQuery();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The Science Behind the Platform.</h1>
          <p className={styles.heroSubtitle}>
            Our technology is grounded in over a decade of peer-reviewed
            research. Explore the publications that form the scientific
            foundation of our platform.
          </p>
        </div>
      </section>

      {/* Publications */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Key Publications</h2>
          <div className={styles.pubList}>
            {pubs?.map((pub) => (
              <div className={styles.pubItem} key={pub.id}>
                <div className={styles.pubYear}>{pub.year}</div>
                <div className={styles.pubMain}>
                  <p className={styles.pubJournal}>{pub.journal}</p>
                  <p className={styles.pubTitle}>
                    {pub.doi ? (
                      <a
                        href={pub.doi}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </p>
                  <p className={styles.pubAuthors}>{pub.authors}</p>
                </div>
                {pub.citationCount && pub.citationCount !== '—' && (
                  <div className={styles.pubCitation}>
                    <span>{pub.citationCount}</span>
                    <p>Citations</p>
                  </div>
                )}
              </div>
            ))}
            {!pubs?.length && (
              <p className={styles.empty}>Publications coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* News */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <div className={styles.newsHeader}>
            <h2 className={styles.sectionTitle}>News</h2>
            {years && years.length > 0 && (
              <div className={styles.yearFilter}>
                <button
                  className={`${styles.yearBtn} ${!year ? styles.yearBtnActive : ''}`}
                  onClick={() => setYear(undefined)}
                  type="button"
                >
                  All
                </button>
                {years.map((y) => (
                  <button
                    className={`${styles.yearBtn} ${year === y ? styles.yearBtnActive : ''}`}
                    key={y}
                    onClick={() => setYear(y)}
                    type="button"
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.newsList}>
            {newsItems?.map((item) => (
              <div className={styles.newsItem} key={item.id}>
                {item.coverImage && (
                  // biome-ignore lint/performance/noImgElement: dynamic user image
                  <img
                    alt={item.title}
                    className={styles.newsImg}
                    src={item.coverImage}
                  />
                )}
                <div className={styles.newsBody}>
                  <div className={styles.newsMeta}>
                    {item.location && <span>{item.location}</span>}
                    <time>
                      {new Intl.DateTimeFormat('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      }).format(new Date(item.publishedAt))}
                    </time>
                  </div>
                  <h3 className={styles.newsTitle}>{item.title}</h3>
                  {item.content && (
                    <div
                      className={`${styles.newsContent} rich-text`}
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted rich text from CMS
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  )}
                </div>
              </div>
            ))}
            {newsItems?.length === 0 && (
              <p className={styles.empty}>No news items for this period.</p>
            )}
          </div>
        </div>
      </section>

      {/* Resources */}
      {resources && resources.length > 0 && (
        <section className={styles.sectionWhite}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Resources for Your Research</h2>
            <div className={styles.resourceGrid}>
              {resources.map((r) => (
                <div className={styles.resourceCard} key={r.id}>
                  <h3 className={styles.resourceName}>{r.name}</h3>
                  {r.description && (
                    <p className={styles.resourceDesc}>{r.description}</p>
                  )}
                  {r.ctaLabel && (
                    <a
                      className={styles.resourceCta}
                      href={
                        r.ctaType === 'download'
                          ? (r.fileUrl ?? '#')
                          : (r.externalUrl ?? '/contact')
                      }
                      rel={
                        r.ctaType !== 'contact'
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      target={r.ctaType !== 'contact' ? '_blank' : undefined}
                    >
                      {r.ctaLabel}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
