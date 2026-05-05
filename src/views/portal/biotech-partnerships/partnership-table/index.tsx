'use client';

import styles from './index.module.scss';

/* Figma 中表格列数据 */
const PARTNERSHIP_TYPES = [
  {
    type: 'Feasibility Study',
    get: 'A rapid, low-commitment proof-of-concept study to validate your hypothesis in our models.',
    bestFor: 'Early-stage biotechs exploring a new target or indication.',
  },
  {
    type: 'Fee-for-Service',
    get: 'Custom drug screening, biomarker discovery, or I-O evaluation studies with full data reporting.',
    bestFor:
      'Companies with defined programs needing high-quality preclinical data.',
  },
  {
    type: 'Strategic Alliance',
    get: 'A long-term collaboration with dedicated model development, co-publication rights, and priority access to our biobank.',
    bestFor: 'Biotechs building a sustained preclinical research program.',
  },
  {
    type: 'Co-Development Program',
    get: 'A true scientific partnership where we co-design the research, co-own the data, and co-publish the findings.',
    bestFor:
      'Biotechs with novel targets or platform technologies seeking a deep scientific collaboration.',
  },
];

/* Info 图标 SVG */
function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10.5" stroke="#286996" strokeWidth="1.5" />
      <rect
        fill="#286996"
        height="7"
        rx="0.75"
        width="1.5"
        x="11.25"
        y="10.5"
      />
      <circle cx="12" cy="7.5" fill="#286996" r="1" />
    </svg>
  );
}

export default function PartnershipTable() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 区块标题: Roboto Serif Regular 40px，居中 */}
        <h2 className={styles.title}>Find the Right Collaboration Structure</h2>

        {/* 主表格：带阴影、圆角 16px */}
        <div className={styles.table}>
          {/* 表头行 */}
          <div className={styles.headerRow}>
            {/* 第一列宽 340px */}
            <div className={styles.headerCell}>
              <span className={styles.headerText}>Partnership Type</span>
            </div>
            <div className={styles.headerCell}>
              <span className={styles.headerText}>What You Get</span>
            </div>
            <div className={styles.headerCell}>
              <span className={styles.headerText}>Best For</span>
            </div>
          </div>

          {/* 数据行 */}
          {PARTNERSHIP_TYPES.map((item) => (
            <div className={styles.dataRow} key={item.type}>
              {/* Partnership Type 列：Roboto Medium 16px，#4D4F56 */}
              <div className={styles.typeCell}>
                <div className={styles.typeCellInner}>
                  {/* 排序图标占位 */}
                  <span aria-hidden="true" className={styles.sortIcon}>
                    <svg
                      aria-hidden="true"
                      fill="none"
                      height="16"
                      viewBox="0 0 16 16"
                      width="16"
                    >
                      <path
                        d="M4 6l4-4 4 4M4 10l4 4 4-4"
                        stroke="#9CA3AF"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  <span className={styles.typeText}>{item.type}</span>
                </div>
              </div>
              {/* What You Get 列：Roboto Regular 16px，#4D4F56 */}
              <div className={styles.descCell}>
                <p className={styles.descText}>{item.get}</p>
              </div>
              {/* Best For 列：Roboto Regular 16px，#4D4F56 */}
              <div className={styles.descCell}>
                <p className={styles.descText}>{item.bestFor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alert 提示栏：背景 #F0F6FF，边框 1px #6CAEDB，圆角 16px */}
        <div className={styles.alert}>
          <span className={styles.alertIcon}>
            <InfoIcon />
          </span>
          <p className={styles.alertText}>
            All partnership types include a dedicated scientific project
            manager, regular progress updates, and a final comprehensive data
            report.
          </p>
        </div>
      </div>
    </section>
  );
}
