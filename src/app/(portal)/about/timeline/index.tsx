import styles from './index.module.scss';

/**
 * Timeline — About 页面 "Our Journey" 区域
 * Figma 545-6644：白底黑字（白色矩形覆盖区域内）
 * 7 个里程碑横向排列，2025 为当前节点（方块 + 大字号）
 */

const MILESTONES = [
  {
    year: '2009',
    label: 'Foundational Science',
    isCurrent: false,
  },
  {
    year: '2014',
    label: 'Oncogenic Transformation',
    isCurrent: false,
    annotation:
      'Li, X., Nadauld, L., ..., Kuo, C.J. publish on oncogenic transformation in GI organoids in Nature Medicine (500+ citations).',
  },
  {
    year: '2016',
    label: 'ALI System Published',
    isCurrent: false,
  },
  {
    year: '2018',
    label: 'TME Breakthrough',
    isCurrent: false,
  },
  {
    year: '2022',
    label: 'Founded',
    isCurrent: false,
  },
  {
    year: '2024',
    label: '1,500+ Models',
    isCurrent: false,
  },
  {
    year: '2025',
    label: 'US Expansion',
    isCurrent: true,
  },
];

export default function Timeline() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Roboto Serif Regular 40px，#000 */}
        <h2 className={styles.sectionTitle}>Our Journey</h2>

        <div className={styles.timeline}>
          {/* 横向连接线 — Figma: stroke 5px gradient #000 → transparent */}
          <div className={styles.line} />

          {MILESTONES.map((m) => (
            <div
              className={`${styles.node} ${m.isCurrent ? styles.nodeCurrent : ''}`}
              key={m.year}
            >
              <div className={styles.marker}>
                {m.isCurrent ? (
                  <div className={styles.squareDot} />
                ) : (
                  <div className={styles.circleDot} />
                )}
              </div>

              <div className={styles.nodeContent}>
                <span
                  className={m.isCurrent ? styles.yearCurrent : styles.year}
                >
                  {m.year}
                </span>
                <span
                  className={m.isCurrent ? styles.labelCurrent : styles.label}
                >
                  {m.label}
                </span>
              </div>

              {/* 注释绝对定位，避免撑大节点列宽 */}
              {m.annotation && (
                <p className={styles.annotation}>{m.annotation}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
