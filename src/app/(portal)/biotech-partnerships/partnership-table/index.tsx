'use client';

import { type IconName, SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

const PARTNERSHIP_TYPES: {
  type: string;
  icon: IconName;
  get: string;
  bestFor: string;
}[] = [
  {
    type: 'Feasibility Study',
    icon: 'partnership-feasibility',
    get: 'A rapid, low-commitment proof-of-concept study to validate your hypothesis in our models.',
    bestFor: 'Early-stage biotechs exploring a new target or indication.',
  },
  {
    type: 'Fee-for-Service',
    icon: 'partnership-fee',
    get: 'Custom drug screening, biomarker discovery, or I-O evaluation studies with full data reporting.',
    bestFor:
      'Companies with defined programs needing high-quality preclinical data.',
  },
  {
    type: 'Strategic Alliance',
    icon: 'partnership-strategic',
    get: 'A long-term collaboration with dedicated model development, co-publication rights, and priority access to our biobank.',
    bestFor:
      'Biotechs with novel targets or platform technologies seeking a deep scientific collaboration.',
  },
  {
    type: 'Co-Development Program',
    icon: 'partnership-codev',
    get: 'A true scientific partnership where we co-design the research, co-own the data, and co-publish the findings.',
    bestFor:
      'Biotechs with novel targets or platform technologies seeking a deep scientific collaboration.',
  },
];

export default function PartnershipTable() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tableGroup}>
          <h2 className={styles.title}>
            Find the Right Collaboration Structure
          </h2>

          <div className={styles.table}>
            <div className={styles.headerRow}>
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

            {PARTNERSHIP_TYPES.map((item) => (
              <div className={styles.dataRow} key={item.type}>
                <div className={styles.typeCell}>
                  <div className={styles.typeCellInner}>
                    <span aria-hidden="true" className={styles.typeIcon}>
                      <SvgIcon color="#1A4C6E" name={item.icon} size={20} />
                    </span>
                    <span className={styles.typeText}>{item.type}</span>
                  </div>
                </div>
                <div className={styles.descCell}>
                  <p className={styles.descText}>{item.get}</p>
                </div>
                <div className={styles.descCell}>
                  <p className={styles.descText}>{item.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.alert}>
          <span className={styles.alertIcon}>
            <SvgIcon color="#286996" name="info" size={24} />
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
