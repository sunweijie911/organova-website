import type { ExpandableCardItem } from '@/components/ExpandableCard';
import { ExpandableCardList } from '@/components/ExpandableCard';
import styles from './index.module.scss';

const ITEMS: ExpandableCardItem[] = [
  {
    icon: 'beaker',
    title: 'The Checkpoint Inhibitor Paradox',
    paragraphs: [
      'The Problem: Your checkpoint inhibitor showed 80% response in cell lines. It failed in Phase II. Why? Because standard models have no immune cells. Our ALI-PDO™ retains the native T-cell and macrophage milieu, so you see the real response before the clinic. We measure T-cell activation, tumor killing, and cytokine release to predict efficacy and resistance with clinical-grade accuracy.',
      'Real Data: In a ccRCC/NSCLC co-culture study, our ALI-PDO™ models maintained TIL retention for >4 weeks. ICB treatment demonstrated measurable CD8+T and NK cell activation with quantifiable tumor killing by FACS analysis.',
    ],
  },
  {
    icon: 'dna',
    title: 'The Cell Therapy Black Box',
    paragraphs: [
      "The Problem: Your CAR-T therapy kills tumor cells in vitro, but you don't know how it performs against solid tumors with a suppressive TME. We model the immunosuppressive microenvironment of solid tumors, allowing you to evaluate CAR-T infiltration, persistence, and efficacy in a clinically-relevant context. See how your therapy overcomes the physical and biochemical barriers of the TME before you commit to a clinical program.",
    ],
  },
  {
    icon: 'cloud-db',
    title: 'The Combination Conundrum',
    paragraphs: [
      "The Problem: You have a checkpoint inhibitor and a targeted therapy. You believe they synergize, but you don't know which patients will respond. We run combination screens across our diverse biobank, identifying the molecular subtypes that respond to your combination. We have demonstrated this approach with bi-specific antibodies, showing BsAb-induced CD8+T and NK cell activation with simultaneous tumor killing quantification by flow cytometry, qPCR, and ELISA.",
    ],
  },
];

export default function ImmunoOncologyProblems() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          We Solve the Problems That End I-O Programs.
        </h2>
        <ExpandableCardList items={ITEMS} />
      </div>
    </section>
  );
}
