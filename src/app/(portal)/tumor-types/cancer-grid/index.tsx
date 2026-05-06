'use client';

import Link from 'next/link';
import { SvgIcon } from '@/components/SvgIcon';
import { api } from '@/lib/trpc/react';
import { parseFormats } from '../utils';
import styles from './index.module.scss';

export default function CancerGrid() {
  const { data, isLoading } = api.cancerTypes.list.useQuery();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>
            Find the Right Model for Your Study.
          </h2>
          <p className={styles.introSub}>
            All models are available in both PDO 1.0 and Organoid 2.0 (ALI-PDO™)
            formats unless otherwise noted.
          </p>
        </div>

        {isLoading && <div className={styles.loading}>Loading...</div>}

        <div className={styles.grid}>
          {data?.map((ct) => {
            const formats = parseFormats(ct.formats);
            return (
              <Link
                className={styles.card}
                href={`/tumor-types/${ct.slug}`}
                key={ct.id}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardTitle}>
                    <h3 className={styles.cardName}>{ct.name}</h3>
                    {formats.length > 0 && (
                      <div className={styles.tags}>
                        {formats.map((f) => (
                          <span className={styles.tag} key={f}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {ct.modelCount && (
                    <p className={styles.cardCount}>{ct.modelCount}</p>
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardLink}>Explore Models</span>
                  <SvgIcon color="#3A84FF" name="chevron-right" size={16} />
                </div>
              </Link>
            );
          })}
        </div>

        {!isLoading && (!data || data.length === 0) && (
          <div className={styles.empty}>Cancer type catalog coming soon.</div>
        )}
      </div>
    </section>
  );
}
