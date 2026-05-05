'use client';

import { useState } from 'react';
import styles from './index.module.scss';

const TABS = [
  {
    id: 'translation',
    label: 'Translation',
    title: 'De-risking Clinical Translation',
    content: `The Problem: Compounds that look effective in conventional models fail in Phase II because those models don't reflect the biological complexity of a real tumor.\n\nOur Solution: We screen your compound across a diverse panel of patient-derived ALI-PDO™ models, providing a statistically robust prediction of clinical response. Our 84.43% clinical outcome prediction rate means you enter the clinic with confidence, not hope.\n\nTypical Use Case: A global pharma partner brought us 12 lead compounds from a KRAS-mutant NSCLC program. We screened across 80 patient models in 6 weeks, identifying the top 3 candidates with the highest predicted response rates and a novel biomarker signature for patient selection.`,
  },
  {
    id: 'validation',
    label: 'Validation',
    title: 'Functional Target Validation',
    content: `The Problem: Genomics can tell you a gene is mutated. It cannot tell you whether that mutation is functionally driving tumor growth—or whether inhibiting it will kill the tumor.\n\nOur Solution: We provide a full suite of functional genomics capabilities, including both CRISPR and shRNA-based screens. From custom-designed focused libraries to unbiased, genome-scale screens, we can systematically dissect gene function, identify novel drug targets, and uncover mechanisms of resistance in a clinically relevant context.\n\nGrounded in landmark published work: Lo, Y.H., et al. Large-scale CRISPR screening in primary human 3D gastric organoids. Nat Commun (2025).`,
  },
  {
    id: 'immunity',
    label: 'Immunity',
    title: 'Immuno-Oncology Readout',
    content: `The Problem: Standard models have no immune cells. Testing an immunotherapy in a model without an immune system is not a preclinical study—it's a hypothesis with no data.\n\nOur Solution: Our ALI-PDO™ models retain native T-cells, macrophages, and NK cells. We measure T-cell activation, tumor killing, cytokine release, and PD-L1 dynamics to give you a true picture of how your I-O drug will perform.\n\nReal Data: In a ccRCC/NSCLC co-culture study, our ALI-PDO™ models maintained TIL retention for >4 weeks. ICB treatment demonstrated measurable CD8+ T and NK cell activation with quantifiable tumor killing by FACS analysis.`,
  },
  {
    id: 'biomarkers',
    label: 'Biomarkers',
    title: 'Biomarker-Driven Patient Stratification',
    content: `The Problem: Entering a clinical trial without a patient selection biomarker dramatically reduces your probability of success and increases cost.\n\nOur Solution: Our multi-omic profiling (transcriptomics, proteomics, metabolomics) identifies the molecular signatures that predict response in our models. We then validate these signatures against clinical outcome data from our biobank, giving you a clinically-anchored biomarker strategy before you enroll a single patient.`,
  },
];

export default function PharmaSolutionsSolutions() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab]!;

  return (
    <section className={styles.solutions}>
      <h2 className={styles.sectionTitle}>
        How We Solve Your Specific Problem
      </h2>

      <div className={styles.cardWrap}>
        <div
          className={styles.card}
          style={{
            backgroundImage: `url('/portal/images/pharma-solutions/tab-card-bg-69f71a.png')`,
          }}
        >
          <div className={styles.cardOverlay} />
          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{tab.title}</h3>
            <p className={styles.cardText}>{tab.content}</p>
          </div>
        </div>
      </div>

      <div className={styles.tabRow}>
        {TABS.map((t, i) => (
          <button
            className={`${styles.tabBtn} ${activeTab === i ? styles.tabActive : ''}`}
            key={t.id}
            onClick={() => setActiveTab(i)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
    </section>
  );
}
