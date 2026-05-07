'use client';

import { ArrowButton } from '@/components/ArrowButton';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

/**
 * OurStory — About 页面 "Our Story" 区域
 * Figma 默认：545-6619（三段卡片 + Read Our Full Story 按钮）
 * Figma 展开：581-11177（5 段完整故事 + Back 灰色按钮）
 * 整段在黑色 hero 区底部之内（白色矩形从 y=2159 之后才覆盖）
 */

interface OurStoryProps {
  expanded: boolean;
  onToggle: () => void;
}

const FULL_STORY = [
  {
    heading: 'The Question That Started Everything',
    body: "Why do 97% of oncology drugs fail in clinical trials—even after years of promising preclinical data? This is the question that drove the founding of OrgaNova TRiCBiO. Not as an academic exercise, but as a frustration shared by scientists who had spent careers at the world's leading pharmaceutical companies—watching drug after drug succeed in the lab, only to fail in patients. The answer, they found, was not in the drugs themselves. It was in the models.",
  },
  {
    heading: 'A Fundamental Flaw in the Foundation',
    body: 'For decades, the preclinical stage of drug development has relied on tools that were never designed to reflect human biology. Standard 2D cell lines grow in plastic dishes, stripped of the three-dimensional architecture and cellular complexity of real tumors. Even first-generation patient-derived organoids—a significant step forward—lose the stromal cells, immune cells, and extracellular matrix that govern how a tumor actually responds to treatment. The result is a systematic illusion of efficacy. Drugs that look effective in these artificial systems fail the moment they encounter the biological reality of a human patient. The model is not a window into the patient—it is a distortion.',
  },
  {
    heading: 'The Breakthrough',
    body: "The scientific foundation for a better approach had been building for over a decade. Beginning with the landmark 2009 Nature Medicine paper on stem cell organoid culture, and culminating in the 2018 Cell paper that demonstrated the preservation of the complete tumor microenvironment in an Air-Liquid Interface system, our founding scientific team had spent 15 years developing and validating the technology that would become Organoid 2.0. The key insight was deceptively simple: instead of isolating and expanding tumor cells, preserve the entire tissue architecture. By culturing a thin slice of tumor tissue at the air-liquid interface, the native cellular community—tumor cells, immune cells, stromal fibroblasts, and their surrounding matrix—remains intact and functional. The result is not a model of a tumor. It is, for all practical purposes, a living fragment of the patient's tumor.",
  },
  {
    heading: 'From Discovery to Platform',
    body: "OrgaNova TRiCBiO was founded in 2022 to translate this scientific breakthrough into a scalable, commercially accessible platform. In three years, we have built a biobank of over 1,500 deeply characterized patient-derived organoid models across 20+ cancer types, validated our platform's clinical prediction accuracy at 84.43% across 152 patient cases, and established partnerships with global pharmaceutical leaders including Eli Lilly and Pharmaron.",
  },
  {
    heading: 'Built for Global Drug Development',
    body: "Our US operations in Philadelphia give us direct access to the world's most active pharmaceutical market, enabling seamless collaboration with US-based pharma and biotech partners, and local sample collection from US clinical sites. Our R&D and production center in Nanjing, China houses our core scientific team and biobank, enabling the scale, speed, and cost-efficiency that global drug development demands.",
  },
];

export default function OurStory({ expanded, onToggle }: OurStoryProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {!expanded ? (
          <>
            {/* Figma: Roboto Serif Regular 40px，白色 */}
            <h2 className={styles.sectionTitle}>Our Story</h2>

            {/* 三段故事（按 Figma 为竖向堆叠，gap 69px） */}
            <div className={styles.storyStack}>
              <div className={styles.storyBlock}>
                <h3 className={styles.blockHeading}>The Question</h3>
                <p className={styles.blockText}>
                  Why do 97% of oncology drugs fail in clinical trials? This
                  question drove our founding—a frustration shared by scientists
                  watching promising drugs fail in patients. The answer wasn't
                  the drugs. It was the models.
                </p>
              </div>

              <div className={styles.storyBlock}>
                <h3 className={styles.blockHeading}>The Breakthrough</h3>
                <p className={styles.blockText}>
                  Grounded in landmark research, our team developed a method to
                  preserve the entire tumor tissue architecture. The result is
                  not a model of a tumor. It is a living fragment of the
                  patient&apos;s tumor.
                </p>
              </div>

              <div className={styles.storyBlock}>
                <h3 className={styles.blockHeading}>The Platform</h3>
                <p className={styles.blockText}>
                  OrgaNova TRiCBiO was founded to translate this breakthrough
                  into a scalable platform. Today, we have a biobank of 1,500+
                  models and have validated our clinical prediction accuracy at
                  84.43%.
                </p>
              </div>
            </div>

            <div className={styles.btnRow}>
              <ArrowButton
                iconVisible="always"
                onClick={onToggle}
                variant="dark"
              >
                Read Our Full Story
              </ArrowButton>
            </div>
          </>
        ) : (
          <>
            {/* Back 按钮：Roboto Regular 20px，#979BA5，左箭头 */}
            <button className={styles.backBtn} onClick={onToggle} type="button">
              <span aria-hidden="true" className={styles.backArrow}>
                <SvgIcon height={14} name="arrow-thin-left" width={28} />
              </span>
              Back
            </button>

            {/* 完整 5 段故事（每段共享 24px Roboto Regular，段首加粗作为视觉强调） */}
            <div className={styles.fullStory}>
              {FULL_STORY.map((p) => (
                <div className={styles.fullParagraph} key={p.heading}>
                  <strong className={styles.fullHeading}>{p.heading}</strong>
                  <p className={styles.fullBody}>{p.body}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
