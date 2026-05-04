'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './index.module.scss';

const CARDS = [
  {
    title: 'The Checkpoint Inhibitor Paradox',
    brief:
      'Your checkpoint inhibitor showed 80% response in cell lines. It failed in Phase II. Why? Because standard models have no immune cells.',
    detail:
      'Our ALI-PDO™ retains the native T-cell and macrophage milieu, so you see the real response before the clinic. We measure T-cell activation, tumor killing, and cytokine release to predict efficacy and resistance with clinical-grade accuracy. In a ccRCC/NSCLC co-culture study, our models maintained TIL retention for >4 weeks. ICB treatment demonstrated measurable CD8+ T and NK cell activation with quantifiable tumor killing by FACS analysis.',
  },
  {
    title: 'The Cell Therapy Black Box',
    brief:
      "Your CAR-T therapy kills tumor cells in vitro, but you don't know how it performs against solid tumors with a suppressive TME.",
    detail:
      'We model the immunosuppressive microenvironment of solid tumors, allowing you to evaluate CAR-T infiltration, persistence, and efficacy in a clinically-relevant context. See how your therapy overcomes the physical and biochemical barriers of the TME before you commit to a clinical program. Our platform supports CAR-T, CAR-NK, and TIL therapy evaluation.',
  },
  {
    title: 'The Combination Conundrum',
    brief:
      "You have a checkpoint inhibitor and a targeted therapy. You believe they synergize, but you don't know which patients will respond.",
    detail:
      'We run combination screens across our diverse biobank, identifying the molecular subtypes that respond to your combination. We have demonstrated this approach with bi-specific antibodies, showing BsAb-induced CD8+ T and NK cell activation with simultaneous tumor killing quantification by flow cytometry, qPCR, and ELISA.',
  },
];

const CAPABILITIES = [
  { label: 'T-Cell Activation', tag: 'FACS' },
  { label: 'Tumor Killing Quantification', tag: 'FACS / Imaging' },
  { label: 'Cytokine Profiling', tag: 'ELISA' },
  { label: 'PD-L1 Dynamics', tag: 'IF / FACS' },
  { label: 'TIL Retention', tag: '>4 weeks' },
  { label: 'NK Cell Activation', tag: 'FACS' },
];

export default function ImmunoOncologyView() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Immuno-Oncology</p>
          <h1 className={styles.heroTitle}>
            Your I-O Drug Needs an Immune System to Fight.
          </h1>
          <p className={styles.heroSubtitle}>
            Testing an immunotherapy in a model without immune cells is not a
            preclinical study—it's a hypothesis with no data. We provide the
            missing battlefield.
          </p>
        </div>
      </section>

      {/* Problem cards */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            We Solve the Problems That End I-O Programs.
          </h2>
          <div className={styles.cardGrid}>
            {CARDS.map((card, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}
                  key={card.title}
                >
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardBrief}>{card.brief}</p>
                  {isOpen && <p className={styles.cardDetail}>{card.detail}</p>}
                  <button
                    className={styles.cardToggle}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    type="button"
                  >
                    {isOpen ? 'Show less ↑' : 'Learn more →'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our I-O Capabilities</h2>
          <div className={styles.capGrid}>
            {CAPABILITIES.map((cap) => (
              <div className={styles.capItem} key={cap.label}>
                <span className={styles.capTag}>{cap.tag}</span>
                <p className={styles.capLabel}>{cap.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Stop Testing in the Dark.</h2>
          <Link className={styles.ctaBtn} href="/contact">
            Talk to Our I-O Team →
          </Link>
        </div>
      </section>
    </div>
  );
}
