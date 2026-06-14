'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { CardLink } from '@/components/CardLink';
import { Pagination } from '@/components/Pagination';
import { PortalSelect } from '@/components/PortalSelect';
import styles from './index.module.scss';

// 每页条数：网格为 3 列，6 条 = 3 列 × 2 行
const PAGE_SIZE = 6;

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
  // 当前页码，从 1 开始；切换年份时重置
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  // Select 选项：All Years + 可用年份；value 用字符串，'all' 表示不过滤
  const yearOptions = [
    { label: 'All Years', value: 'all' },
    ...(years?.map((y) => ({ label: String(y), value: String(y) })) ?? []),
  ];

  // 客户端分页：按 PAGE_SIZE 切片当前页（年份过滤已在服务端完成）
  const totalPages = Math.ceil((newsItems?.length ?? 0) / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const paged = newsItems?.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // 翻页：更新页码并把列表区滚回顶部
  const handlePageChange = (next: number) => {
    setPage(next);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.section} id="news" ref={sectionRef}>
      <div className={styles.inner}>
        {/* Year filter —— PortalSelect compact 变体（Figma 1199:6285/6900/6999） */}
        <div className={styles.filterBlock}>
          <PortalSelect
            label="Filter by year:"
            onChange={(v) => {
              onYearChange(v === 'all' ? undefined : Number(v));
              setPage(1);
            }}
            options={yearOptions}
            placeholder="All Years"
            value={selectedYear ? String(selectedYear) : 'all'}
            variant="compact"
          />
        </div>

        {/* 新闻网格（3 列） */}
        <div className={styles.grid}>
          {paged?.map((item) => (
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

              {/* Read more —— 复用 CardLink 组件（蓝 #3A84FF + hover 箭头右移），对齐 Figma 581:11028 */}
              <Link className={styles.readMore} href={`/news/${item.id}`}>
                <CardLink label="Read more" />
              </Link>
            </article>
          ))}
        </div>

        {/* 分页器：仅当多于一页时显示 */}
        <Pagination
          className={styles.pager}
          currentPage={safePage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />

        {newsItems?.length === 0 && (
          <p className={styles.empty}>No news items for this period.</p>
        )}
      </div>
    </section>
  );
}
