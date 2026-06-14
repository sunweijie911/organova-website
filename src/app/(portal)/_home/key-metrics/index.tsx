import styles from './index.module.scss';

const METRICS = [
  {
    value: '84.43%',
    title: 'Clinical Outcome Prediction Accuracy',
    desc: 'Based on a retrospective analysis of 152 patient cases across 5 solid tumor types (NSCLC, CRC, Breast, Gastric, Pancreatic), comparing ALI-PDO™ drug sensitivity results with actual patient clinical outcomes.',
    bg: '/assets/images/home/metrics/metric-bg-1.png',
  },
  {
    value: '1,500+',
    title: 'Patient-Derived Organoid Models',
    desc: 'Our biobank includes 1,500+ PDO models spanning 20+ cancer types, with full genomic and clinical annotation.',
    bg: '/assets/images/home/metrics/metric-bg-2.png',
  },
  {
    value: '20+',
    title: 'Solid Tumor Types Covered',
    desc: 'Including HCC, CRC, NSCLC, Gastric, Breast, Ovarian, Pancreatic, RCC, GBM, Biliary Tract, Head & Neck, Prostate, GIST, Osteosarcoma, and more.',
    bg: '/assets/images/home/metrics/metric-bg-3.png',
  },
  {
    value: '2-3 Weeks',
    title: 'Standard Study Turnaround',
    desc: 'From sample receipt to final report. Feasibility studies in as little as 4 weeks.',
    bg: '/assets/images/home/metrics/metric-bg-4.png',
  },
];

const CARD_OVERLAY =
  'linear-gradient(rgb(58 46 63 / 0.55), rgb(58 46 63 / 0.55))';

export default function KeyMetrics() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>KEY METRICS</h2>
      <div className={styles.grid}>
        {METRICS.map((m) => (
          <div className={styles.card} key={m.value}>
            <div
              className={styles.cardBg}
              style={{
                backgroundImage: `${CARD_OVERLAY}, url(${m.bg})`,
              }}
            />
            <span className={styles.value}>{m.value}</span>
            <span className={styles.cardTitle}>{m.title}</span>
            <div className={styles.descPanel}>
              <p className={styles.desc}>{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
