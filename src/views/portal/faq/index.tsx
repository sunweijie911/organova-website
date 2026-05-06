'use client';

import { useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { api } from '@/lib/trpc/react';
import FaqContent from './faq-content';
import HeroBanner from './hero-banner';
import styles from './index.module.scss';

const DEFAULT_CATEGORY = 'About Our Technology';

export default function FaqView() {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const { data, isLoading } = api.faq.listWithItems.useQuery();

  return (
    <div className={styles.page}>
      <BrandLogo variant="dark" />
      <HeroBanner
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <FaqContent
        activeCategory={activeCategory}
        data={data}
        isLoading={isLoading}
      />
    </div>
  );
}
