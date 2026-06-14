'use client';

import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 分页器 — Figma 1199:6284
 * 布局：[← Previous Page]  [1 2 …]  [Next Page →]，三组间距 80px
 * - Prev/Next 在边界页禁用并置灰（#C4C6CC），可用态 #979BA5
 * - 当前页码 Roboto Bold 20px 黑色，其余 Regular 20px #979BA5，页码间距 40px
 * 总页数 ≤ 1 时不渲染。
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className={`${styles.pagination} ${className ?? ''}`}
    >
      <button
        className={styles.nav}
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <SvgIcon
          className={styles.flip}
          height={20}
          name="arrow-thin-right"
          width={20}
        />
        <span>Previous Page</span>
      </button>

      <div className={styles.pages}>
        {pages.map((p) => (
          <button
            aria-current={p === currentPage ? 'page' : undefined}
            className={p === currentPage ? styles.pageActive : styles.page}
            disabled={p === currentPage}
            key={p}
            onClick={() => onPageChange(p)}
            type="button"
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className={styles.nav}
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        <span>Next Page</span>
        <SvgIcon height={20} name="arrow-thin-right" width={20} />
      </button>
    </nav>
  );
}
