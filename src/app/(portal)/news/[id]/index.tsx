'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import SafeHtml from '@/components/SafeHtml';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

/**
 * News 详情 — Figma 581:12319 (Popup)
 * 白底，内容左对齐 padding 240px：
 *  - "News" 标 (Roboto SemiBold 20px)
 *  - 标题 (Roboto Serif Regular 36px)
 *  - 日期 04.15.2026 (Roboto Light 16px)
 *  - 富文本正文 (Roboto Regular 24px)
 */
function formatDotDate(date: Date | string): string {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}.${dd}.${yyyy}`;
}

export default function NewsDetailView() {
  const params = useParams<{ id: string }>();
  const numericId = Number(params.id);

  const { data, isLoading } = api.news.getById.useQuery(
    { id: numericId },
    { enabled: Number.isFinite(numericId) },
  );

  if (isLoading) {
    return (
      <>
        <BrandLogo />
        <div className={styles.loading}>Loading...</div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <BrandLogo />
        <div className={styles.notFound}>
          News not found.{' '}
          <Link href="/publications?tab=news">← Back to News</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <BrandLogo />
      <article className={styles.article}>
        <span className={styles.tag}>News</span>
        <h1 className={styles.title}>{data.title}</h1>
        <span className={styles.date}>{formatDotDate(data.publishedAt)}</span>

        {data.content && (
          <SafeHtml
            className={`${styles.content} rich-text`}
            html={data.content}
          />
        )}

        <Link className={styles.backLink} href="/publications?tab=news">
          ← Back to News
        </Link>
      </article>
    </>
  );
}
