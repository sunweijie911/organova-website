'use client';

import Link from 'next/link';
import styles from './index.module.scss';

const PARTNERSHIP_TYPES = [
  {
    type: 'Feasibility Study',
    get: 'Rapid, low-commitment proof-of-concept study. Validate your hypothesis in our models.',
    bestFor: 'Early-stage Biotech exploring new targets or indications.',
  },
  {
    type: 'Fee-for-Service',
    get: 'Custom drug screening, biomarker discovery, or I-O evaluation with full data report.',
    bestFor:
      'Companies needing high-quality preclinical data for IND strategy or fundraising.',
  },
  {
    type: 'Strategic Alliance',
    get: 'Long-term partnership with dedicated model development, co-publication rights, and priority biobank access.',
    bestFor: 'Biotech building a sustained preclinical research program.',
  },
  {
    type: 'Co-Development Program',
    get: 'Co-design research, co-own data, co-publish findings.',
    bestFor:
      'Biotech with novel target technology seeking deep scientific partnership.',
  },
];

const INCLUDES = [
  {
    icon: '◎',
    label: 'Dedicated Scientific Project Manager',
    desc: 'A PhD-level scientist manages your program end-to-end.',
  },
  {
    icon: '◎',
    label: 'Regular Progress Updates',
    desc: 'Weekly data reviews and transparent communication throughout.',
  },
  {
    icon: '◎',
    label: 'Comprehensive Final Data Report',
    desc: 'Publication-ready data packages with full methodology and QC.',
  },
];

export default function BiotechPartnershipsView() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>For Biotech Partners</p>
          <h1 className={styles.heroTitle}>
            We Don't Just Run Your Assay. We Build Your Science.
          </h1>
          <p className={styles.heroSubtitle}>
            For biotech companies that need more than a CRO—a scientific partner
            who understands your biology and shares your ambition.
          </p>
        </div>
      </section>

      {/* Partnership table */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Find the Right Collaboration Structure
          </h2>
          <div className={styles.partnerTable}>
            <div className={styles.partnerHeader}>
              <span>Collaboration Type</span>
              <span>What You Get</span>
              <span>Best For</span>
            </div>
            {PARTNERSHIP_TYPES.map((p, i) => (
              <div
                className={`${styles.partnerRow} ${i % 2 === 0 ? styles.partnerRowAlt : ''}`}
                key={p.type}
              >
                <span className={styles.partnerType}>{p.type}</span>
                <span className={styles.partnerGet}>{p.get}</span>
                <span className={styles.partnerBest}>{p.bestFor}</span>
              </div>
            ))}
          </div>
          <p className={styles.partnerNote}>
            All collaboration types include a dedicated scientific project
            manager, regular progress updates, and a comprehensive final data
            report.
          </p>
        </div>
      </section>

      {/* Includes */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Every Partnership Includes</h2>
          <div className={styles.includeGrid}>
            {INCLUDES.map((item) => (
              <div className={styles.includeItem} key={item.label}>
                <span className={styles.includeIcon}>{item.icon}</span>
                <h3 className={styles.includeLabel}>{item.label}</h3>
                <p className={styles.includeDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Let's Build the Science Together.</h2>
          <Link className={styles.ctaBtn} href="/contact">
            Start a Conversation →
          </Link>
        </div>
      </section>
    </div>
  );
}
