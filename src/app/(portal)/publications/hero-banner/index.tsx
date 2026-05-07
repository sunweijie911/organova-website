'use client';

import styles from './index.module.scss';

export type PublicationsTab = 'publications' | 'resources' | 'news';

interface HeroBannerProps {
  activeTab: PublicationsTab;
  onTabChange: (tab: PublicationsTab) => void;
}

const TABS: { key: PublicationsTab; label: string }[] = [
  { key: 'publications', label: 'Key Publications' },
  { key: 'resources', label: 'Resources for Your Research' },
  { key: 'news', label: 'News' },
];

/**
 * Hero Banner — Figma 545:6055 / 545:6284 / 581:10714
 * 白底，Roboto Serif 64px 大标题，下方 tab 导航（Light 300 / Medium 500 + 下划线），Roboto 24px 描述
 * 三个 tab 视觉切换：未选中 weight 300，选中 weight 500
 */
export default function HeroBanner({
  activeTab,
  onTabChange,
}: HeroBannerProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>The Science Behind the Platform.</h1>

        <nav aria-label="Publications tabs" className={styles.tabNav}>
          {TABS.map(({ key, label }) => (
            <button
              className={activeTab === key ? styles.tabActive : styles.tabLink}
              key={key}
              onClick={() => onTabChange(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>

        <p className={styles.subtitle}>
          Our technology is grounded in over a decade of peer-reviewed research.
          Explore the publications that form the scientific foundation of our
          platform.
        </p>
      </div>
    </section>
  );
}
