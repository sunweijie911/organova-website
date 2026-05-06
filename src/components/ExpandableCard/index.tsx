'use client';

import { useState } from 'react';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

export interface ExpandableCardItem {
  icon: IconName;
  title: string;
  brief?: string;
  detail?: string;
  paragraphs?: string[];
}

interface ExpandableCardListProps {
  items: ExpandableCardItem[];
}

export function ExpandableCardList({ items }: ExpandableCardListProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className={styles.list}>
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        const compact = !item.brief;
        const content = item.paragraphs ?? (item.detail ? [item.detail] : []);
        return (
          <div
            className={`${styles.card} ${compact ? styles.cardCompact : ''} ${isOpen ? styles.cardOpen : ''}`}
            key={item.title}
          >
            <button
              className={styles.header}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              type="button"
            >
              <div className={styles.left}>
                <div
                  className={`${styles.iconBox} ${compact ? styles.iconBoxCompact : ''}`}
                >
                  <SvgIcon name={item.icon} size={compact ? 34 : 48} />
                </div>
                <div className={styles.text}>
                  <span className={styles.title}>{item.title}</span>
                  {item.brief && (
                    <span className={styles.brief}>{item.brief}</span>
                  )}
                </div>
              </div>
              <div
                className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
              >
                <SvgIcon name={isOpen ? 'arrow-up' : 'arrow-down'} size={20} />
              </div>
            </button>
            {isOpen && content.length > 0 && (
              <>
                <div className={styles.divider} />
                {content.map((p, i) => (
                  <p
                    className={`${styles.detail} ${i > 0 ? styles.detailSpaced : ''}`}
                    key={i}
                  >
                    {p}
                  </p>
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
