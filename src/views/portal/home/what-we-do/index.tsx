'use client';

import { useState } from 'react';
import { ArrowButton } from '@/components/ArrowButton';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

const CONTENT = {
  label: 'WHAT WE DO',
  title: 'From Biological Complexity to \n Clinical Certainty.',
  description:
    'Our Organoid 2.0 (ALI-PDO™) technology is the first to preserve the \n native tumor microenvironment in a scalable format, revealing how \n a drug truly behaves in a patient.',
  cta: {
    text: 'Learn more',
    desc: `The genetic blueprint doesn't guarantee the biological outcome. For decades, \n preclinical models have failed to capture the intricate reality of human \n tumors, leading to a 97% clinical trial failure rate in oncology.

    We are changing that. Our Organoid 2.0 (ALI-PDO™) technology is the first to \n preserve the native tumor microenvironment (TME)—including stromal and \n immune cells—in a high-throughput, scalable format. This living, functional \n model of human biology allows us to see what others can't: how a drug truly \n behaves in a patient.`,
  },
};

export default function WhatWeDo() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.section}>
      <div className={`${styles.main} ${expanded ? styles.hidden : ''}`}>
        <span className={styles.label}>{CONTENT.label}</span>
        <div className={styles.content}>
          <h2 className={styles.title}>{CONTENT.title}</h2>
          <p className={styles.description}>{CONTENT.description}</p>
          <ArrowButton onClick={() => setExpanded(true)}>
            {CONTENT.cta.text}
          </ArrowButton>
        </div>
      </div>

      <div className={`${styles.detail} ${expanded ? styles.visible : ''}`}>
        <button
          className={styles.back}
          onClick={() => setExpanded(false)}
          type="button"
        >
          <SvgIcon className={styles.backArrow} name="arrow-right" size={32} />
          <span className={styles.backText}>Back</span>
        </button>
        <p className={styles.detailText}>{CONTENT.cta.desc}</p>
      </div>
    </section>
  );
}
