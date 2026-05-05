'use client';

import styles from './index.module.scss';

/**
 * OurStory — About 页面"Our Story"区域
 * Figma: 545-6619 中间白色区域，三列卡片（The Question / The Breakthrough / The Platform）
 * 支持展开/收起完整故事（storyExpanded）
 */

interface OurStoryProps {
  storyExpanded: boolean;
  onToggle: () => void;
}

export default function OurStory({ storyExpanded, onToggle }: OurStoryProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 区块标题 */}
        <h2 className={styles.sectionTitle}>Our Story</h2>

        {/* 三列故事卡片 */}
        <div className={styles.storyGrid}>
          <div className={styles.storyBlock}>
            {/* Figma: Roboto Bold 32px */}
            <h3 className={styles.blockHeading}>The Question</h3>
            <p className={styles.blockText}>
              Why do 97% of oncology drugs fail in clinical trials? This
              question drove our founding—a frustration shared by scientists
              watching promising drugs fail in patients. The answer wasn't the
              drugs. It was the models.
            </p>
          </div>

          <div className={styles.storyBlock}>
            <h3 className={styles.blockHeading}>The Breakthrough</h3>
            <p className={styles.blockText}>
              Grounded in landmark research, our team developed a method to
              preserve the entire tumor tissue architecture. The result is not a
              model of a tumor. It is a living fragment of the patient's tumor.
            </p>
          </div>

          <div className={styles.storyBlock}>
            <h3 className={styles.blockHeading}>The Platform</h3>
            <p className={styles.blockText}>
              OrgaNova TRiCBiO was founded to translate this breakthrough into a
              scalable platform. Today, we have a biobank of 1,500+ models and
              have validated our clinical prediction accuracy at 84.43%.
            </p>
          </div>
        </div>

        {/* 展开时显示完整故事 */}
        {storyExpanded && (
          <div className={styles.expandedContent}>
            <div className={styles.expandedInner}>
              <h3 className={styles.expandedHeading}>
                The Question That Started Everything
              </h3>
              <p className={styles.expandedText}>
                Why do 97% of oncology drugs fail in clinical trials—even after
                years of promising preclinical data? This is the question that
                drove the founding of OrgaNova TRiCBiO. Not as an academic
                exercise, but as a frustration shared by scientists who had
                spent careers at the world's leading pharmaceutical
                companies—watching drug after drug succeed in the lab, only to
                fail in patients. The answer, they found, was not in the drugs
                themselves. It was in the models.
              </p>

              <h3 className={styles.expandedHeading}>
                A Fundamental Flaw in the Foundation
              </h3>
              <p className={styles.expandedText}>
                For decades, the preclinical stage of drug development has
                relied on tools that were never designed to reflect human
                biology. Standard 2D cell lines grow in plastic dishes, stripped
                of the three-dimensional architecture and cellular complexity of
                real tumors. Even first-generation patient-derived organoids—a
                significant step forward—lose the stromal cells, immune cells,
                and extracellular matrix that govern how a tumor actually
                responds to treatment. The result is a systematic illusion of
                efficacy.
              </p>

              <h3 className={styles.expandedHeading}>The Breakthrough</h3>
              <p className={styles.expandedText}>
                The scientific foundation for a better approach had been
                building for over a decade. Beginning with the landmark 2009
                Nature Medicine paper, and culminating in the 2018 Cell paper
                that demonstrated the preservation of the complete tumor
                microenvironment in an Air-Liquid Interface system, our founding
                scientific team had spent 15 years developing and validating the
                technology that would become Organoid 2.0. The key insight was
                deceptively simple: instead of isolating and expanding tumor
                cells, preserve the entire tissue architecture.
              </p>

              <h3 className={styles.expandedHeading}>
                From Discovery to Platform
              </h3>
              <p className={styles.expandedText}>
                OrgaNova TRiCBiO was founded in 2022 to translate this
                scientific breakthrough into a scalable, commercially accessible
                platform. In three years, we have built a biobank of over 1,500
                deeply characterized patient-derived organoid models across 20+
                cancer types, validated our platform's clinical prediction
                accuracy at 84.43% across 152 patient cases, and established
                partnerships with global pharmaceutical leaders including Eli
                Lilly and Pharmaron. Our US operations in Philadelphia give us
                direct access to the world's most active pharmaceutical market.
              </p>
            </div>
          </div>
        )}

        {/* 展开/收起按钮 — Figma: Roboto Regular 20px，带箭头，描边按钮 */}
        <button className={styles.toggleBtn} onClick={onToggle} type="button">
          {storyExpanded ? 'Show Less' : 'Read Our Full Story'}
          <span className={styles.btnArrow}>
            {storyExpanded ? (
              /* 向上箭头 */
              <svg
                aria-hidden="true"
                fill="none"
                height="20"
                viewBox="0 0 30 20"
                width="30"
              >
                <path
                  d="M1 14 L15 3 L29 14"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            ) : (
              /* 向右箭头 */
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                viewBox="0 0 30 16"
                width="30"
              >
                <path
                  d="M0 8H27M27 8L20 1M27 8L20 15"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            )}
          </span>
        </button>
      </div>
    </section>
  );
}
