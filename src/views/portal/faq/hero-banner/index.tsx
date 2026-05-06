'use client';

import styles from './index.module.scss';

const CATEGORIES = [
  'About Our Technology',
  'About Our Services',
  'About Our Biobank',
  'About Partnerships',
  'About Quality & Compliance',
];

interface HeroBannerProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function HeroBanner({
  activeCategory,
  onCategoryChange,
}: HeroBannerProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Your Questions, Answered.</h1>
        <nav className={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <button
              className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
              key={cat}
              onClick={() => onCategoryChange(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
