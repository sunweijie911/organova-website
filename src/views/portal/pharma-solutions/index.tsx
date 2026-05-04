'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './index.module.scss';

const TABS = [
  {
    id: 'translation',
    label: 'De-risking Clinical Translation',
    content: `The Problem: Compounds that look effective in conventional models fail in Phase II because those models don't reflect the biological complexity of a real tumor.

Our Solution: We screen your compound across a diverse panel of patient-derived ALI-PDO™ models, providing a statistically robust prediction of clinical response. Our 84.43% clinical outcome prediction rate means you enter the clinic with confidence, not hope.

Typical Use Case: A global pharma partner brought us 12 lead compounds from a KRAS-mutant NSCLC program. We screened across 80 patient models in 6 weeks, identifying the top 3 candidates with the highest predicted response rates and a novel biomarker signature for patient selection.`,
  },
  {
    id: 'target',
    label: 'Functional Target Validation',
    content: `The Problem: Genomics can tell you a gene is mutated. It cannot tell you whether that mutation is functionally driving tumor growth—or whether inhibiting it will kill the tumor.

Our Solution: We provide a full suite of functional genomics capabilities, including both CRISPR and shRNA-based screens. From custom-designed focused libraries to unbiased, genome-scale screens, we can systematically dissect gene function, identify novel drug targets, and uncover mechanisms of resistance in a clinically relevant context.

Grounded in landmark published work: Lo, Y.H., et al. Large-scale CRISPR screening in primary human 3D gastric organoids. Nat Commun (2025).`,
  },
  {
    id: 'io',
    label: 'Immuno-Oncology Readout',
    content: `The Problem: Standard models have no immune cells. Testing an immunotherapy in a model without an immune system is not a preclinical study—it's a hypothesis with no data.

Our Solution: Our ALI-PDO™ models retain native T-cells, macrophages, and NK cells. We measure T-cell activation, tumor killing, cytokine release, and PD-L1 dynamics to give you a true picture of how your I-O drug will perform.

Real Data: In a ccRCC/NSCLC co-culture study, our ALI-PDO™ models maintained TIL retention for >4 weeks. ICB treatment demonstrated measurable CD8+ T and NK cell activation with quantifiable tumor killing by FACS analysis.`,
  },
  {
    id: 'biomarker',
    label: 'Biomarker-Driven Patient Stratification',
    content: `The Problem: Entering a clinical trial without a patient selection biomarker dramatically reduces your probability of success and increases cost.

Our Solution: Our multi-omic profiling (transcriptomics, proteomics, metabolomics) identifies the molecular signatures that predict response in our models. We then validate these signatures against clinical outcome data from our biobank, giving you a clinically-anchored biomarker strategy before you enroll a single patient.`,
  },
];

const STAGES = [
  {
    stage: 'Early Discovery',
    items: [
      'Target validation',
      'Biomarker identification',
      'Hit-to-lead screening',
    ],
  },
  {
    stage: 'Lead Optimization',
    items: [
      'Drug efficacy screening',
      'Combination synergy',
      'Mechanism of action studies',
    ],
  },
  {
    stage: 'Clinical Translation',
    items: [
      'Co-clinical studies',
      'Patient stratification',
      'IND-enabling data packages',
    ],
  },
];

export default function PharmaSolutionsView() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>For Pharmaceutical Partners</p>
          <h1 className={styles.heroTitle}>
            Your Drug Works. Your Model Is Lying.
          </h1>
          <p className={styles.heroSubtitle}>
            Preclinical success on artificial models isn't success—it's a
            delayed failure. We provide the biological truth needed to make
            confident go/no-go decisions.
          </p>
          <Link className={styles.heroBtn} href="/contact">
            Discuss Your Program
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            How We Solve Your Specific Problem
          </h2>
          <div className={styles.tabNav}>
            {TABS.map((tab, i) => (
              <button
                className={`${styles.tabBtn} ${activeTab === i ? styles.tabBtnActive : ''}`}
                key={tab.id}
                onClick={() => setActiveTab(i)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.tabContent}>
            {TABS[activeTab]?.content.split('\n\n').map((para, i) => (
              <p className={styles.tabPara} key={i}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline stages */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Built for Every Stage of Drug Development
          </h2>
          <div className={styles.stageGrid}>
            {STAGES.map((s, i) => (
              <div className={styles.stageCard} key={i}>
                <span className={styles.stageNum}>0{i + 1}</span>
                <h3 className={styles.stageTitle}>{s.stage}</h3>
                <ul className={styles.stageList}>
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to De-Risk Your Pipeline?</h2>
          <Link className={styles.ctaBtn} href="/request-quote">
            Request a Quote →
          </Link>
        </div>
      </section>
    </div>
  );
}
