import { BrandLogo } from '@/components/BrandLogo';
import SafeHtml from '@/components/SafeHtml';
import type { news } from '@/server/db/schema';
import { BackLink } from './back-link';
import styles from './index.module.scss';

/**
 * News 详情 — Figma 581:12319 (Popup)
 * 白底，内容左对齐 padding 240px：
 *  - "News" 标 (Roboto SemiBold 20px)
 *  - 标题 (Roboto Serif Regular 36px)
 *  - 日期 04.15.2026 (Roboto Light 16px)
 *  - 富文本正文 (Roboto Regular 24px)
 */
type NewsRow = typeof news.$inferSelect;

function formatDotDate(date: Date | string): string {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}.${dd}.${yyyy}`;
}

export default function NewsDetailView({ news }: { news: NewsRow }) {
  return (
    <>
      <BrandLogo />
      <article className={styles.article}>
        <span className={styles.tag}>News</span>
        <h1 className={styles.title}>{news.title}</h1>
        <span className={styles.date}>{formatDotDate(news.publishedAt)}</span>

        {news.content && (
          <SafeHtml
            className={`${styles.content} rich-text`}
            html={news.content}
          />
        )}

        <BackLink className={styles.backLink}>← Back to News</BackLink>
      </article>
    </>
  );
}
