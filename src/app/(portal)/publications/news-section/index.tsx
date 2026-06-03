'use client';

import Link from 'next/link';
import { Select } from '@/components/Select';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

/**
 * News 区域 — Figma 581:10714
 * 白底，顶部 year filter（小尺寸按钮组），下方两列网格（每列 3 条）
 * 每个条目：日期 + 来源 + 标题（点击进详情） + Read more 链接
 */
interface NewsItem {
  id: number;
  coverImage?: string | null;
  title: string;
  location?: string | null;
  publishedAt: Date | string;
  content?: string | null;
}

interface NewsSectionProps {
  newsItems?: NewsItem[];
  years?: number[];
  selectedYear?: number;
  onYearChange: (year: number | undefined) => void;
}

function formatLongDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export default function NewsSection({
  newsItems,
  years,
  selectedYear,
  onYearChange,
}: NewsSectionProps) {
  // Select 选项：All Years + 可用年份；value 用字符串，'all' 表示不过滤
  const yearOptions = [
    { label: 'All Years', value: 'all' },
    ...(years?.map((y) => ({ label: String(y), value: String(y) })) ?? []),
  ];

  return (
    <section className={styles.section} id="news">
      <div className={styles.inner}>
        {/* Year filter */}
        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>Filter by year:</span>
          <Select
            ariaLabel="Filter by year"
            onChange={(v) => onYearChange(v === 'all' ? undefined : Number(v))}
            options={yearOptions}
            value={selectedYear ? String(selectedYear) : 'all'}
          />
        </div>

        {/* 两列新闻网格 */}
        <div className={styles.grid}>
          {newsItems?.map((item) => (
            <article className={styles.item} key={item.id}>
              <div className={styles.itemMeta}>
                <span className={styles.itemDate}>
                  {formatLongDate(item.publishedAt)}
                </span>
                {item.location && (
                  <span className={styles.itemJournal}>{item.location}</span>
                )}
              </div>

              <Link className={styles.itemTitleLink} href={`/news/${item.id}`}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
              </Link>

              <Link className={styles.readMore} href={`/news/${item.id}`}>
                Read more
                <SvgIcon
                  color="rgba(0,0,0,0.4)"
                  height={11}
                  name="arrow-thin-right"
                  width={17}
                />
              </Link>
            </article>
          ))}
        </div>

        {newsItems?.length === 0 && (
          <p className={styles.empty}>No news items for this period.</p>
        )}
      </div>
    </section>
  );
}
