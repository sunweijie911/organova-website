'use client';

import { ArrowButton } from '@/components/ArrowButton';
import styles from './index.module.scss';

/**
 * OurStory — About 页面 "Our Story" 区域
 * Figma 默认：545-6619（三段卡片 + Read Our Full Story 按钮）
 * 完整故事改为弹窗呈现（见 ./dialog.tsx），点击按钮打开，关闭后保留滚动位置
 * 整段在黑色 hero 区底部之内（白色矩形从 y=2159 之后才覆盖）
 */

interface OurStoryProps {
  onReadFullStory: () => void;
}

export default function OurStory({ onReadFullStory }: OurStoryProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Figma: Roboto Serif Regular 40px，白色 */}
        <h2 className={styles.sectionTitle}>Our Story</h2>

        {/* 三段故事（按 Figma 为竖向堆叠，gap 69px） */}
        <div className={styles.storyStack}>
          <div className={styles.storyBlock}>
            <h3 className={styles.blockHeading}>The Question</h3>
            <p className={styles.blockText}>
              Why do 97% of oncology drugs fail in clinical trials? This
              question drove our founding—a frustration shared by scientists
              watching promising drugs fail in patients. The answer was not the
              drugs. It was the models.
            </p>
          </div>

          <div className={styles.storyBlock}>
            <h3 className={styles.blockHeading}>The Breakthrough</h3>
            <p className={styles.blockText}>
              Grounded in landmark research, our team developed a method to
              preserve the entire tumor tissue architecture. The result is not a
              model of a tumor. It is a living fragment of the patient&apos;s
              tumor.
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

        <div className={styles.btnRow}>
          <ArrowButton onClick={onReadFullStory} variant="dark">
            Read Our Full Story
          </ArrowButton>
        </div>
      </div>
    </section>
  );
}
