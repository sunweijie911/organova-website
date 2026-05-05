import styles from './index.module.scss';

const ROWS = [
  {
    feature: 'Microenvironment',
    conv2d: 'Absent',
    pdo1: 'Partial (Tumor cells only)',
    ali: 'Fully Preserved (Tumor + Stromal + Immune)',
  },
  {
    feature: 'Immune Component',
    conv2d: 'Absent',
    pdo1: 'Absent',
    ali: 'Native, Functional Immune Cells (>80% retention)',
  },
  {
    feature: 'Clinical Prediction Rate',
    conv2d: '10–30%',
    pdo1: '40–60%',
    ali: '65–93% (avg. 84.43%)',
  },
  {
    feature: 'Applications',
    conv2d: 'Basic screening',
    pdo1: 'Drug sensitivity',
    ali: 'I-O, ADC, Cell Therapy, Biomarker Discovery, Functional Genomics',
  },
  {
    feature: 'Format',
    conv2d: '2D monolayer',
    pdo1: 'Matrigel-embedded',
    ali: 'Air-Liquid Interface (ALI), 96/384-well compatible',
  },
  {
    feature: 'Culture Stability',
    conv2d: 'Weeks',
    pdo1: '2–4 weeks',
    ali: '>30 days (up to 200 days demonstrated)',
  },
];

export default function ComparisonTable() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Not All Organoids Are Created Equal.</h2>
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={`${styles.cell} ${styles.colFeature} ${styles.th}`}>
              Feature
            </div>
            <div className={`${styles.cell} ${styles.colConv} ${styles.th}`}>
              Conventional 2D Cell Lines
            </div>
            <div className={`${styles.cell} ${styles.colPdo} ${styles.th}`}>
              PDO 1.0 (Standard Organoids)
            </div>
            <div className={`${styles.cell} ${styles.colAli} ${styles.th}`}>
              OrgaNova ALI-PDO™ 2.0
            </div>
          </div>
          {ROWS.map((row, i) => (
            <div className={styles.dataRow} key={i}>
              <div
                className={`${styles.cell} ${styles.colFeature} ${styles.td}`}
              >
                {row.feature}
              </div>
              <div className={`${styles.cell} ${styles.colConv} ${styles.td}`}>
                {row.conv2d}
              </div>
              <div className={`${styles.cell} ${styles.colPdo} ${styles.td}`}>
                {row.pdo1}
              </div>
              <div className={`${styles.cell} ${styles.colAli} ${styles.td}`}>
                {row.ali}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
