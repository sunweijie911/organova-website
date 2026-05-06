import type { ExpandableCardItem } from '@/components/ExpandableCard';
import { ExpandableCardList } from '@/components/ExpandableCard';
import styles from './index.module.scss';

const ITEMS: ExpandableCardItem[] = [
  {
    icon: 'target',
    title: 'Target Discovery & Validation',
    brief: 'CRISPR/shRNA screens from focused libraries to genome-scale.',
    detail:
      'We provide a full suite of functional genomics capabilities, including both CRISPR (KO/CRISPRi/CRISPRa) and shRNA-based screens. Our offering spans from custom-designed focused libraries (targeting specific pathways or gene families) to unbiased, genome-scale screens covering the entire human genome. All screens are performed in our 3D organoid context, providing target validation data in a clinically relevant biological system. Leveraging our experience from landmark studies in large-scale screening in primary human 3D organoids (Lo, Y.H., et al., Nat Commun, 2025), we can systematically dissect gene function, identify novel drug targets, and uncover mechanisms of resistance.',
  },
  {
    icon: 'beaker',
    title: 'Drug Efficacy Evaluation',
    brief: '84.43% accuracy. 96/384-well format. 2–3 week turnaround.',
    detail:
      'Our drug efficacy platform supports testing of all major drug modalities: small molecules, biologics/antibodies, ADCs, ICB agents, cell & gene therapies, and nucleic acids. Standard studies are completed in 2–3 weeks from sample receipt. We offer single-agent dose-response (IC50), combination synergy studies, and long-term MOA studies (up to 200 days demonstrated). All studies include H&E, IHC, and qPCR quality control.',
  },
  {
    icon: 'shield',
    title: 'Safety & Toxicity Assessment',
    brief: '35 normal tissue types. >30-day stability. Multi-organ models.',
    detail:
      'Our safety platform includes 35 validated normal tissue organoid types, covering key organs relevant to drug toxicity: lung (pulmonary toxicity, fibrosis), kidney (nephrotoxicity), liver (hepatotoxicity), intestine (GI toxicity), heart (cardiotoxicity, under development), and brain/BBB (CNS toxicity, under development). All models are validated by mIF, qPCR, and functional assays.',
  },
  {
    icon: 'microscope',
    title: 'Translational Medicine',
    brief:
      'FACS, IHC, multi-omics. Patient stratification. Biomarker discovery.',
    detail:
      'Our translational medicine capabilities bridge the gap between preclinical data and clinical strategy. We offer FACS analysis (immune cell profiling, tumor killing quantification), IHC/IF validation, multi-omics analysis (genomics, transcriptomics, proteomics), and patient stratification based on biomarker signatures. Our co-clinical study design allows real-time comparison of model predictions with patient outcomes.',
  },
  {
    icon: 'database',
    title: 'Biobank & Model Access',
    brief: '1,500+ PDOs. 20+ cancer types. Rapid access. Full annotation.',
    detail:
      'Our biobank contains 1,500+ PDO models across 20+ cancer types, with full genomic (WES) and transcriptomic (RNA-seq) characterization linked to de-identified patient clinical data. Models are available in both PDO 1.0 and Organoid 2.0 (ALI-PDO™) formats. US biobank (Philadelphia): 676+ FFPE blocks, 35 normal tissue types. China biobank (Nanjing): 400+ HCC, 300+ CRC, 200+ RCC, 150+ PDAC, 150+ Breast, 120+ Sarcoma, 100+ NSCLC, 80+ GBM, and more.',
  },
];

export default function Capabilities() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          Five Capabilities. One Integrated Platform.
        </h2>
        <ExpandableCardList items={ITEMS} />
      </div>
    </section>
  );
}
