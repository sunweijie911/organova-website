'use client';

import { useEffect } from 'react';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './dialog.module.scss';

/**
 * OurStoryDialog — "Read Our Full Story" 全屏弹窗
 * 黑底白字 4 段完整故事（纯正文，无小标题）+ 左上 Back 灰色按钮
 * 弹窗形式：底层页面不滚动，关闭后自动保留原滚动位置
 */

const FULL_STORY = [
  {
    id: 'question',
    body: "Why do 97% of oncology drugs fail in clinical trials—even after years of promising preclinical data? This is the question that drove the founding of OrgaNova TRiCBiO. Not as an academic exercise, but as a frustration shared by scientists who had spent careers at the world's leading pharmaceutical companies—watching drug after drug succeed in the lab, only to fail in patients. The answer, they found, was not in the drugs themselves. It was in the models.",
  },
  {
    id: 'flaw',
    body: 'For decades, the preclinical stage of drug development has relied on tools that were never designed to reflect human biology. Standard 2D cell lines grow in plastic dishes, stripped of the three-dimensional architecture and cellular complexity of real tumors. Even first-generation patient-derived organoids—a significant step forward—lose the stromal cells, immune cells, and extracellular matrix that govern how a tumor actually responds to treatment. The result is a systematic illusion of efficacy. Drugs that look effective in these artificial systems fail the moment they encounter the biological reality of a human patient. The model is not a window into the patient—it is a distortion.',
  },
  {
    id: 'breakthrough',
    body: "The scientific foundation for a better approach had been building for over a decade. Beginning with the landmark 2009 Nature Medicine paper on stem cell organoid culture, and culminating in the 2018 Cell paper that demonstrated the preservation of the complete tumor microenvironment in an Air-Liquid Interface system, our founding scientific team had spent 15 years developing and validating the technology that would become Organoid 2.0. The key insight was deceptively simple: instead of isolating and expanding tumor cells, preserve the entire tissue architecture. By culturing a thin slice of tumor tissue at the air-liquid interface, the native cellular community—tumor cells, immune cells, stromal fibroblasts, and their surrounding matrix—remains intact and functional. The result is not a model of a tumor. It is, for all practical purposes, a living fragment of the patient's tumor.",
  },
  {
    id: 'platform',
    body: "OrgaNova TRiCBiO was founded in 2022 to translate this scientific breakthrough into a scalable, commercially accessible platform. In three years, we have built a biobank of over 1,500 deeply characterized patient-derived organoid models across 20+ cancer types, validated our platform's clinical prediction accuracy at 84.43% across 152 patient cases, and established partnerships with global pharmaceutical leaders including Eli Lilly and Pharmaron. Our US operations in Philadelphia give us direct access to the world's most active pharmaceutical market, enabling seamless collaboration with US-based pharma and biotech partners, and local sample collection from US clinical sites. Our R&D and production center in Nanjing, China houses our core scientific team and biobank, enabling the scale, speed, and cost-efficiency that global drug development demands.",
  },
];

interface OurStoryDialogProps {
  onClose: () => void;
}

export default function OurStoryDialog({ onClose }: OurStoryDialogProps) {
  // Esc 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div aria-modal="true" className={styles.overlay} role="dialog">
      {/* 透明背板按钮 — 捕获背景点击关闭 */}
      <button
        aria-label="Close"
        className={styles.backdrop}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />

      <div className={styles.card}>
        {/* Back 按钮：Roboto Regular 20px，#979BA5，左箭头 */}
        <button className={styles.backBtn} onClick={onClose} type="button">
          <span aria-hidden="true" className={styles.backArrow}>
            <SvgIcon height={28} name="arrow-thin-left" width={28} />
          </span>
          Back
        </button>

        {/* 完整 4 段故事（纯正文，无小标题） */}
        <div className={styles.fullStory}>
          {FULL_STORY.map((p) => (
            <p className={styles.fullBody} key={p.id}>
              {p.body}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
