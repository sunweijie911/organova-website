'use client';

import Link from 'next/link';
import { CardLink } from '@/components/CardLink';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

interface FilterOptions {
  cancerTypes: string[];
  applications: string[];
}

interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  cancerTypeTags: string[];
  applicationTags: string[];
}

interface Counts {
  cancer: Record<string, number>;
  app: Record<string, number>;
}

interface Props {
  options?: FilterOptions;
  cancerType: string;
  application: string;
  counts: Counts;
  totalCount: number;
  onCancerTypeChange: (value: string) => void;
  onApplicationChange: (value: string) => void;
  data?: CaseStudy[];
  isLoading?: boolean;
}

// 单个过滤标签：根据 active / disabled 状态切换样式
interface TagProps {
  label: string;
  count?: number;
  isAll?: boolean;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}

function FilterTag({
  label,
  count,
  isAll,
  active,
  disabled,
  onClick,
}: TagProps) {
  const cls = [
    styles.tag,
    active && styles.tagActive,
    disabled && styles.tagDisabled,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      className={cls}
      disabled={disabled && !active}
      onClick={onClick}
      type="button"
    >
      <span className={styles.tagLabel}>{label}</span>
      {!isAll && <span className={styles.tagCount}>{count ?? 0}</span>}
    </button>
  );
}

// Figma 539:1770 - Group 9
// 区块背景 #F5F5F5；标题区 padding 100px 240px 48px
// 两行过滤器：白底 + #DCDEE5 边框 + padding 24px 240px
// 卡片 468px 宽，border-radius 16px，#DCDEE5 边框
export default function ListFiltersGrid({
  options,
  cancerType,
  application,
  counts,
  totalCount,
  onCancerTypeChange,
  onApplicationChange,
  data,
  isLoading,
}: Props) {
  // 当前已选中的过滤项（用于 Active 行）
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (cancerType !== 'All') {
    activeFilters.push({
      key: 'cancer',
      label: cancerType,
      clear: () => onCancerTypeChange('All'),
    });
  }
  if (application !== 'All') {
    activeFilters.push({
      key: 'app',
      label: application,
      clear: () => onApplicationChange('All'),
    });
  }
  const hasActive = activeFilters.length > 0;

  const clearAll = () => {
    onCancerTypeChange('All');
    onApplicationChange('All');
  };

  return (
    <section className={styles.section}>
      {/* 区块标题 */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>CASE STUDY GALLERY</h2>
        <p className={styles.sectionDesc}>
          Explore our validated organoid platform case studies across cancer
          types and application areas.
        </p>
      </div>

      {options && (
        <>
          {/* Cancer Type 行 */}
          <div className={styles.filterRow}>
            <div className={styles.filterInner}>
              <span className={styles.filterLabel}>Cancer Type</span>
              <div className={styles.tagList}>
                {options.cancerTypes.map((t) => {
                  const isAll = t === 'All';
                  const c = isAll ? totalCount : (counts.cancer[t] ?? 0);
                  return (
                    <FilterTag
                      active={cancerType === t}
                      count={c}
                      disabled={!isAll && c === 0}
                      isAll={isAll}
                      key={t}
                      label={t}
                      onClick={() => onCancerTypeChange(t)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Application 行：无 Active 行时自带阴影分隔，否则由 Active 行承担阴影 */}
          <div
            className={`${styles.filterRow} ${hasActive ? '' : styles.filterRowShadow}`.trim()}
          >
            <div className={styles.filterInner}>
              <span className={styles.filterLabel}>Application</span>
              <div className={styles.tagList}>
                {options.applications.map((t) => {
                  const isAll = t === 'All';
                  const c = isAll ? totalCount : (counts.app[t] ?? 0);
                  return (
                    <FilterTag
                      active={application === t}
                      count={c}
                      disabled={!isAll && c === 0}
                      isAll={isAll}
                      key={t}
                      label={t}
                      onClick={() => onApplicationChange(t)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Active 行：展示当前选中的过滤标签，可单独移除或一键清空 */}
      {hasActive && (
        <div className={styles.activeRow}>
          <div className={styles.activeInner}>
            <span className={styles.activeLabel}>Active</span>
            <div className={styles.activeBody}>
              <div className={styles.activeTags}>
                {activeFilters.map((f) => (
                  <button
                    className={styles.activeTag}
                    key={f.key}
                    onClick={f.clear}
                    type="button"
                  >
                    <span>{f.label}</span>
                    <span className={styles.activeTagClose}>
                      <SvgIcon name="close" size={11} />
                    </span>
                  </button>
                ))}
              </div>
              <button
                className={styles.clearAll}
                onClick={clearAll}
                type="button"
              >
                <SvgIcon name="trash" size={16} />
                <span>Clear all</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 卡片区 */}
      <div className={styles.gridWrapper}>
        <p className={styles.resultCount}>
          Showing <strong>{data?.length ?? 0}</strong> of{' '}
          <strong>{totalCount}</strong> case studies
        </p>

        {isLoading && (
          <div className={styles.loading}>Loading case studies...</div>
        )}

        {!isLoading && (
          <div className={styles.grid}>
            {data?.map((cs) => (
              <Link
                className={styles.card}
                href={`/case-studies/${cs.slug}`}
                key={cs.id}
              >
                <div className={styles.cardBody}>
                  {/* Frame 61：标题 + chip 行，column gap 16px */}
                  <div className={styles.cardTitleBlock}>
                    <h3 className={styles.cardTitle}>{cs.title}</h3>

                    {/* 标签 chip 行 */}
                    <div className={styles.cardTagRow}>
                      {cs.cancerTypeTags.slice(0, 2).map((t) => (
                        <span className={styles.cardChip} key={`c-${t}`}>
                          {t}
                        </span>
                      ))}
                      {cs.applicationTags.slice(0, 1).map((t) => (
                        <span className={styles.cardChip} key={`a-${t}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 摘要 */}
                  {cs.summary && (
                    <p className={styles.cardSummary}>{cs.summary}</p>
                  )}

                  {/* 跳转链接 */}
                  <CardLink
                    className={styles.cardLink}
                    label="Read Full Case Study"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && data?.length === 0 && (
          <div className={styles.empty}>
            No case studies match the selected filters.
          </div>
        )}
      </div>
    </section>
  );
}
