'use client';

import { Tabs } from '@/components/Tabs';
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
          <Tabs
            activeKey={activeCategory}
            className={styles.tabs}
            items={categories.map((cat) => ({ key: cat, label: cat }))}
            onChange={onCategoryChange}
          />
        )}
      </div>
    </section>
  );
}
