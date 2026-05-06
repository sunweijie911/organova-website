'use client';

import Link from 'next/link';
import styles from './index.module.scss';

// 过滤选项类型
interface FilterOptions {
  cancerTypes: string[];
  applications: string[];
}

// 案例研究卡片数据类型（id 为 number，与 API 返回一致）
interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  cancerTypeTags: string[];
  applicationTags: string[];
}

interface Props {
  // 过滤选项
  options?: FilterOptions;
  // 当前选中的过滤值
  cancerType: string;
  application: string;
  // 过滤器切换回调
  onCancerTypeChange: (value: string) => void;
  onApplicationChange: (value: string) => void;
  // 列表数据
  data?: CaseStudy[];
  isLoading?: boolean;
}

// 右箭头 SVG 图标
function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// 列表页 过滤器 + 卡片网格 区域
// Figma 节点：581:10342（Group 9，背景 #F5F5F5）
// 标题区：padding 100px 240px 48px；过滤行：padding 24px 240px；卡片 468px 宽，border-radius 16px
export default function ListFiltersGrid({
  options,
  cancerType,
  application,
  onCancerTypeChange,
  onApplicationChange,
  data,
  isLoading,
}: Props) {
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

      {/* Cancer Type 过滤器行 */}
      {options && (
        <>
          <div className={styles.filterRow}>
            <div className={styles.filterInner}>
              <span className={styles.filterLabel}>Cancer Type</span>
              <div className={styles.tagList}>
                {options.cancerTypes.map((t) => (
                  <button
                    className={`${styles.tag} ${cancerType === t ? styles.tagActive : ''}`}
                    key={t}
                    onClick={() => onCancerTypeChange(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Application 过滤器行 */}
          <div className={`${styles.filterRow} ${styles.filterRowShadow}`}>
            <div className={styles.filterInner}>
              <span className={styles.filterLabel}>Application</span>
              <div className={styles.tagList}>
                {options.applications.map((a) => (
                  <button
                    className={`${styles.tag} ${application === a ? styles.tagActive : ''}`}
                    key={a}
                    onClick={() => onApplicationChange(a)}
                    type="button"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 结果数量 + 卡片网格 */}
      <div className={styles.gridWrapper}>
        {/* 结果计数 */}
        <p className={styles.resultCount}>
          Showing <strong>{data?.length ?? 0}</strong> case studies
        </p>

        {/* 加载状态 */}
        {isLoading && (
          <div className={styles.loading}>Loading case studies...</div>
        )}

        {/* 卡片网格 */}
        {!isLoading && (
          <div className={styles.grid}>
            {data?.map((cs) => (
              <Link
                className={styles.card}
                href={`/case-studies/${cs.slug}`}
                key={cs.id}
              >
                {/* 封面图 */}
                {cs.coverImage && (
                  <div className={styles.cardCover}>
                    <img
                      alt={cs.title}
                      className={styles.cardCoverImg}
                      src={cs.coverImage}
                    />
                  </div>
                )}

                <div className={styles.cardBody}>
                  {/* 标题 */}
                  <h3 className={styles.cardTitle}>{cs.title}</h3>

                  {/* 标签行 */}
                  <div className={styles.cardTagRow}>
                    {/* 癌症类型标签 */}
                    {cs.cancerTypeTags.slice(0, 2).map((t) => (
                      <span className={styles.cardTag} key={t}>
                        {t}
                      </span>
                    ))}
                    {/* 应用类型标签 */}
                    {cs.applicationTags.slice(0, 1).map((t) => (
                      <span className={styles.cardTag} key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* 摘要 */}
                  {cs.summary && (
                    <p className={styles.cardSummary}>{cs.summary}</p>
                  )}

                  {/* 阅读链接 */}
                  <div className={styles.cardLink}>
                    <span>Read Full Case Study</span>
                    <ArrowIcon />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && data?.length === 0 && (
          <div className={styles.empty}>
            No case studies match the selected filters.
          </div>
        )}
      </div>
    </section>
  );
}
