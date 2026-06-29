import styles from './index.module.scss';

/**
 * Timeline — About 页面 "Our Journey" 区域
 * Figma 545-6644：白底黑字（白色矩形覆盖区域内）
 * 8 个里程碑横向排列，2025 为当前节点（方块 + 大字号）
 */
const MILESTONES = [
  {
    year: '2009',
    label: 'Foundational Science',
    isCurrent: false,
    description:
      'Founding scientific team publishes first stem cell organoid culture paper in Nature Medicine (1,000+ citations). Ootani, A., ..., Kuo, C.J.',
  },
  {
    year: '2014',
    label: 'Oncogenic Transformation',
    isCurrent: false,
    description:
      'Li, X., Nadauld, L., ..., Kuo, C.J. publish on oncogenic transformation in GI organoids in Nature Medicine (500+ citations).',
  },
  {
    year: '2016',
    label: 'ALI System Published',
    isCurrent: false,
    description:
      'Li, X., Ootani, A., Kuo, C. publish the ALI culture system method in Cell Reports.',
  },
  {
    year: '2018',
    label: 'TME Breakthrough',
    isCurrent: false,
    description:
      'Landmark Cell paper by Neal, J.T., Li, X., ..., Kuo, C.J. demonstrates complete TME preservation in ALI system (1,400+ citations).',
  },
  // {
  //   year: '2019',
  //   label: 'Organoid 2.0',
  //   isCurrent: false,
  //   description:
  //     'Nature Reviews Cancer names the approach "Organoid 2.0" (112+ citations).',
  // },
  {
    year: '2022',
    label: 'Founded',
    isCurrent: false,
    description: 'OrgaNova TRiCBiO founded; ALI-PDO™ platform established.',
  },
  {
    year: '2024',
    label: '1,500+ Models',
    isCurrent: false,
    description:
      '1,500+ patient samples validated; 20+ cancer types covered; strategic partnership with Eli Lilly.',
  },
  {
    year: '2025',
    label: 'US Expansion',
    isCurrent: true,
    description:
      'US operations established in Philadelphia. Lo, Y.H., ..., Kuo, C.J. publish large-scale CRISPR screening in primary human 3D gastric organoids in Nature Communications.',
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

              {/* hover tooltip：绝对定位浮层，避免撑大节点列宽 */}
              {m.description && (
                <p className={styles.tooltip}>{m.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
