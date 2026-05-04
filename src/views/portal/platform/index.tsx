'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './index.module.scss';

const COMPARISON = [
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
    ali: 'Native, Functional (>80% retention for >4 weeks)',
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
    ali: 'ALI, 96/384-well compatible',
  },
  {
    feature: 'Culture Stability',
    conv2d: 'Weeks',
    pdo1: '2–4 weeks',
    ali: '>30 days (up to 200 days demonstrated)',
  },
];

const CAPABILITIES = [
  {
    num: '01',
    title: 'Target Discovery & Validation',
    brief: 'CRISPR/shRNA screens from focused libraries to genome-scale.',
    detail:
      'We provide a full suite of functional genomics capabilities, including both CRISPR (KO/CRISPRi/CRISPRa) and shRNA-based screens. Our offering spans from custom-designed focused libraries (targeting specific pathways or gene families) to unbiased, genome-scale screens covering the entire human genome. All screens are performed in our 3D organoid context, providing target validation data in a clinically relevant biological system.',
  },
  {
    num: '02',
    title: 'Drug Efficacy Evaluation',
    brief: '84.43% accuracy. 96/384-well format. 2–3 week turnaround.',
    detail:
      'Our drug efficacy platform supports testing of all major drug modalities: small molecules, biologics/antibodies, ADCs, ICB agents, cell & gene therapies, and nucleic acids. Standard studies are completed in 2–3 weeks from sample receipt. We offer single-agent dose-response (IC50), combination synergy studies, and long-term MOA studies (up to 200 days demonstrated).',
  },
  {
    num: '03',
    title: 'Safety & Toxicity Assessment',
    brief: '35 normal tissue types. >30-day stability. Multi-organ models.',
    detail:
      'Our safety platform includes 35 validated normal tissue organoid types, covering key organs relevant to drug toxicity: lung (pulmonary toxicity, fibrosis), kidney (nephrotoxicity), liver (hepatotoxicity), intestine (GI toxicity), heart (cardiotoxicity), and brain/BBB (CNS toxicity). All models are validated by mIF, qPCR, and functional assays.',
  },
  {
    num: '04',
    title: 'Translational Medicine',
    brief:
      'FACS, IHC, multi-omics. Patient stratification. Biomarker discovery.',
    detail:
      'Our translational medicine capabilities bridge the gap between preclinical data and clinical strategy. We offer FACS analysis (immune cell profiling, tumor killing quantification), IHC/IF validation, multi-omics analysis (genomics, transcriptomics, proteomics), and patient stratification based on biomarker signatures. Our co-clinical study design allows real-time comparison of model predictions with patient outcomes.',
  },
  {
    num: '05',
    title: 'Biobank & Model Access',
    brief: '1,500+ PDOs. 20+ cancer types. Rapid access. Full annotation.',
    detail:
      'Our biobank contains 1,500+ PDO models across 20+ cancer types, with full genomic (WES) and transcriptomic (RNA-seq) characterization linked to de-identified patient clinical data. Models are available in both PDO 1.0 and Organoid 2.0 (ALI-PDO™) formats. US biobank (Philadelphia): 676+ FFPE blocks, 35 normal tissue types. China biobank (Nanjing): 400+ HCC, 300+ CRC, 200+ RCC, 150+ PDAC, 150+ Breast, 120+ Sarcoma, 100+ NSCLC, 80+ GBM, and more.',
  },
];

export default function PlatformView() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>ALI-PDO™ Technology Platform</p>
          <h1 className={styles.heroTitle}>
            The World's Most Clinically-Relevant Preclinical Model.
          </h1>
          <p className={styles.heroSubtitle}>
            Our Organoid 2.0 (ALI-PDO™) platform is the first to preserve the
            native tumor microenvironment at scale, providing an unprecedented
            window into human cancer biology.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Not All Organoids Are Created Equal.
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thFeature}>Feature</th>
                  <th className={styles.thPlain}>Conventional 2D Cell Lines</th>
                  <th className={styles.thPlain}>PDO 1.0</th>
                  <th className={styles.thAccent}>OrgaNova ALI-PDO™ 2.0</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr className={styles.tr} key={row.feature}>
                    <td className={styles.tdFeature}>{row.feature}</td>
                    <td className={styles.tdPlain}>{row.conv2d}</td>
                    <td className={styles.tdPlain}>{row.pdo1}</td>
                    <td className={styles.tdAccent}>{row.ali}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Five Capabilities */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Five Capabilities. One Integrated Platform.
          </h2>
          <div className={styles.accordion}>
            {CAPABILITIES.map((cap, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ''}`}
                  key={cap.num}
                >
                  <button
                    className={styles.accordionHeader}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    type="button"
                  >
                    <span className={styles.accordionNum}>{cap.num}</span>
                    <span className={styles.accordionTitle}>{cap.title}</span>
                    <span className={styles.accordionBrief}>{cap.brief}</span>
                    <span className={styles.accordionChevron}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className={styles.accordionBody}>
                      <p>{cap.detail}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Your Drug Deserves a Better Model.
          </h2>
          <Link className={styles.ctaBtn} href="/request-quote">
            Request a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
