'use client';

import styles from './index.module.scss';

interface HeroBannerProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function HeroBanner({
  categories,
  activeCategory,
  onCategoryChange,
}: HeroBannerProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Your Questions, Answered.</h1>
        {categories.length > 0 && (
          <nav className={styles.tabs}>
            {categories.map((cat) => (
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
        )}
      </div>
    </section>
  );
}
