import styles from './index.module.scss';

/**
 * Timeline — About 页面里程碑时间线区域
 * Figma: 节点 545-6644 "Our Journey"，黑色背景
 * 里程碑横向排列，每个节点有：圆点 + 年份（Bold 16px）+ 描述（Light 14px）
 * 2025 年为当前节点，使用方形标记 + 加粗样式
 */

const MILESTONES = [
  {
    year: '2009',
    label: 'Foundational Science',
    description:
      'Seminal stem cell organoid culture paper (Nature Medicine, 1,000+ citations)',
    isCurrent: false,
  },
  {
    year: '2014',
    label: 'Oncogenic Transformation',
    description:
      'Li, X., Nadauld, L., ..., Kuo, C.J. publish on oncogenic transformation in GI organoids in Nature Medicine (500+ citations).',
    isCurrent: false,
  },
  {
    year: '2016',
    label: 'ALI System Published',
    description: 'ALI culture system methodology (Cell Reports)',
    isCurrent: false,
  },
  {
    year: '2018',
    label: 'TME Breakthrough',
    description:
      'Complete TME preservation landmark paper (Cell, 1,400+ citations)',
    isCurrent: false,
  },
  {
    year: '2022',
    label: 'Founded',
    description: 'OrgaNova TRiCBiO founded; ALI-PDO™ platform established',
    isCurrent: false,
  },
  {
    year: '2024',
    label: '1,500+ Models',
    description:
      '1,500+ patient models validated; strategic partnership with Eli Lilly',
    isCurrent: false,
  },
  {
    year: '2025',
    label: 'US Expansion',
    description:
      'US operations in Philadelphia; large-scale CRISPR screen paper (Nat Commun)',
    isCurrent: true,
  },
];

export default function Timeline() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Figma: Roboto Serif Regular 40px，白色 */}
        <h2 className={styles.sectionTitle}>Our Journey</h2>

        {/* 时间线横向布局 */}
        <div className={styles.timeline}>
          {/* 连接线 */}
          <div className={styles.line} />

          {MILESTONES.map((m) => (
            <div
              className={`${styles.node} ${m.isCurrent ? styles.nodeCurrent : ''}`}
              key={m.year}
            >
              {/* 节点标记：圆形（普通）或方形（当前） */}
              <div className={styles.marker}>
                {m.isCurrent ? (
                  <div className={styles.squareDot} />
                ) : (
                  <div className={styles.circleDot} />
                )}
              </div>

              {/* 文字内容 */}
              <div className={styles.nodeContent}>
                {/* Figma: Roboto Bold 16px（普通节点）或 Roboto Bold 32px（当前节点） */}
                <span
                  className={m.isCurrent ? styles.yearCurrent : styles.year}
                >
                  {m.year}
                </span>
                {/* Figma: Roboto Light 14px（普通）或 Roboto Regular 20px（当前） */}
                <span
                  className={m.isCurrent ? styles.labelCurrent : styles.label}
                >
                  {m.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2014 年悬浮注释文字（Figma 中有），引用 MILESTONES 数组避免重复维护 */}
        <p className={styles.annotation}>{MILESTONES[1]?.description}</p>
      </div>
    </section>
  );
}
