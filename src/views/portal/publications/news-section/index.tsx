'use client';

import styles from './index.module.scss';

/**
 * News 区域组件
 * 对应 Figma 节点 581-10714
 * 白色背景，顶部有 year filter（下拉框样式），
 * 内容两列排列，每列3个条目，每条目含日期+期刊+标题+Read more
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

export default function NewsSection({
  newsItems,
  years,
  selectedYear,
  onYearChange,
}: NewsSectionProps) {
  // 格式化日期为 "Month DD, YYYY" 格式，对应 Figma "March 13, 2025"
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <section className={styles.section} id="news">
      <div className={styles.inner}>
        {/* Year filter 区域：对应 Figma Frame 80，column 布局，gap:11px */}
        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>Filter by year:</span>
          {/* 下拉框样式的 filter（Figma 中是 border 0.5px，padding 8px 10px） */}
          <div className={styles.filterDropdown}>
            <button
              className={`${styles.filterBtn} ${!selectedYear ? styles.filterBtnActive : ''}`}
              onClick={() => onYearChange(undefined)}
              type="button"
            >
              All Years
            </button>
            {years?.map((y) => (
              <button
                className={`${styles.filterBtn} ${selectedYear === y ? styles.filterBtnActive : ''}`}
                key={y}
                onClick={() => onYearChange(y)}
                type="button"
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* 两大列区域：对应 Figma Frame 86（column, gap:162px） */}
        {/* 内层每列是 Frame 81/82（column, gap:46px）+ Frame 85（row, justify-between） */}
        <div className={styles.grid}>
          {newsItems?.map((item) => (
            <article className={styles.item} key={item.id}>
              {/* 日期 + 期刊/来源，column 布局，gap:5px */}
              <div className={styles.itemMeta}>
                <span className={styles.itemDate}>
                  {formatDate(item.publishedAt)}
                </span>
                {item.location && (
                  <span className={styles.itemJournal}>{item.location}</span>
                )}
              </div>

              {/* 标题：Roboto Serif Regular 20px */}
              <h3 className={styles.itemTitle}>{item.title}</h3>

              {/* Read more + 箭头，以及 rich-text 内容折叠 */}
              <div className={styles.itemFooter}>
                {item.content ? (
                  <details className={styles.expandable}>
                    <summary className={styles.readMore}>
                      Read more{' '}
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="11"
                        viewBox="0 0 17 11"
                        width="17"
                      >
                        <path
                          d="M1 5.5H15.5M15.5 5.5L11 1M15.5 5.5L11 10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </summary>
                    <div
                      className={`${styles.richContent} rich-text`}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </details>
                ) : (
                  <span className={styles.readMore}>
                    Read more{' '}
                    <svg
                      aria-hidden="true"
                      fill="none"
                      height="11"
                      viewBox="0 0 17 11"
                      width="17"
                    >
                      <path
                        d="M1 5.5H15.5M15.5 5.5L11 1M15.5 5.5L11 10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* 空状态 */}
        {newsItems?.length === 0 && (
          <p className={styles.empty}>No news items for this period.</p>
        )}
      </div>
    </section>
  );
}
