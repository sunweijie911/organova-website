'use client';

import { useMemo, useRef, useState } from 'react';
import { CardLink } from '@/components/CardLink';
import { Pagination } from '@/components/Pagination';
import { PortalSelect } from '@/components/PortalSelect';
import styles from './index.module.scss';

// 每页条数：网格为 3 列，6 条 = 3 列 × 2 行
const PAGE_SIZE = 6;

/**
 * Publications 列表组件
 * 对应 Figma 节点 545-6284（Publications 列表区域）
 * 白色背景，两列网格，每个卡片包含占位图 + 日期期刊 + 标题 + 作者 + "Read more"
 */
interface Publication {
  id: number;
  year: number;
  journal: string;
  title: string;
  doi?: string | null;
  authors: string;
  citationCount?: string | null;
}

interface PublicationsListProps {
  publications?: Publication[];
}

// DOI 既可能是裸格式（10.xxx/yyy）也可能是完整 URL；裸格式必须前缀 doi.org，
// 否则会被当成站内相对路径解析成 /publications/10.xxx/yyy。
// cspell:ignore yyy
function toDoiHref(doi: string): string {
  return /^https?:\/\//i.test(doi) ? doi : `https://doi.org/${doi}`;
}

export default function PublicationsList({
  publications,
}: PublicationsListProps) {
  // 选中年份；undefined 表示 All Years（不过滤）
  const [year, setYear] = useState<number | undefined>();
  // 当前页码，从 1 开始；切换年份时重置
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  // 从全量列表派生可用年份，降序去重
  const years = useMemo(() => {
    const set = new Set(publications?.map((p) => p.year));
    return [...set].sort((a, b) => b - a);
  }, [publications]);

  const yearOptions = [
    { label: 'All Years', value: 'all' },
    ...years.map((y) => ({ label: String(y), value: String(y) })),
  ];

  // 客户端按年份过滤（全量数据已在前端）
  const filtered = year
    ? publications?.filter((p) => p.year === year)
    : publications;

  // 客户端分页：按 PAGE_SIZE 切片当前页
  const totalPages = Math.ceil((filtered?.length ?? 0) / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const paged = filtered?.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // 翻页：更新页码并把列表区滚回顶部
  const handlePageChange = (next: number) => {
    setPage(next);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.section} id="publications" ref={sectionRef}>
      <div className={styles.inner}>
        {/* Year filter —— PortalSelect compact 变体，仅当有数据时显示 */}
        {!!publications?.length && (
          <div className={styles.filterBlock}>
            <PortalSelect
              label="Filter by year:"
              onChange={(v) => {
                setYear(v === 'all' ? undefined : Number(v));
                setPage(1);
              }}
              options={yearOptions}
              placeholder="All Years"
              value={year ? String(year) : 'all'}
              variant="compact"
            />
          </div>
        )}

        {/* 卡片网格（3 列） */}
        <div className={styles.grid}>
          {paged?.map((pub) => {
            const doiHref = pub.doi ? toDoiHref(pub.doi) : null;
            return (
              <article className={styles.card} key={pub.id}>
                {/* 占位图区域：Figma 中为 452×280 的灰色矩形 */}
                <div aria-hidden="true" className={styles.imgPlaceholder} />

                {/* 卡片内容区 */}
                <div className={styles.body}>
                  {/* 日期 + 期刊名 */}
                  <div className={styles.meta}>
                    <span className={styles.year}>{pub.year}</span>
                    <span className={styles.journal}>{pub.journal}</span>
                  </div>

                  {/* 标题：Roboto Serif Regular 20px，可点击链接 */}
                  <p className={styles.title}>
                    {doiHref ? (
                      <a
                        className={styles.titleLink}
                        href={doiHref}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </p>

                  {/* 底部：引用数 + Read more */}
                  <div className={styles.footer}>
                    {/* 作者 / 引用数 */}
                    {pub.citationCount && pub.citationCount !== '—' ? (
                      <span className={styles.citation}>
                        {pub.citationCount}
                      </span>
                    ) : (
                      <span className={styles.authors}>{pub.authors}</span>
                    )}

                    {/* Read more 链接：仅在有 DOI 时显示，统一用 CardLink 组件 */}
                    {doiHref && (
                      <a
                        className={styles.readMoreLink}
                        href={doiHref}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <CardLink label="Read more" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 分页器：仅当多于一页时显示 */}
        <Pagination
          className={styles.pager}
          currentPage={safePage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />

        {/* 空状态：完全无数据 vs 当前年份无结果 */}
        {!publications?.length && (
          <p className={styles.empty}>Publications coming soon.</p>
        )}
        {!!publications?.length && filtered?.length === 0 && (
          <p className={styles.empty}>No publications for this period.</p>
        )}
      </div>
    </section>
  );
}
