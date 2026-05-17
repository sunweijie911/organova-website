'use client';

import { useMemo, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { api } from '@/lib/trpc/react';
import FaqContent from './faq-content';
import HeroBanner from './hero-banner';
import styles from './index.module.scss';

export default function FaqView() {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { data, isLoading } = api.faq.listWithItems.useQuery();

  const categoryNames = useMemo(() => data?.map((c) => c.name) ?? [], [data]);

  // 接口返回后若当前 activeCategory 为空或已不存在，自动回退到第一个分类
  const effectiveCategory =
    activeCategory && categoryNames.includes(activeCategory)
      ? activeCategory
      : (categoryNames[0] ?? '');

  return (
    <div className={styles.page}>
      <BrandLogo bg="dark" />
      <HeroBanner
        activeCategory={effectiveCategory}
        categories={categoryNames}
        onCategoryChange={setActiveCategory}
      />
      <FaqContent
        activeCategory={effectiveCategory}
        data={data}
        isLoading={isLoading}
      />
    </div>
  );
}
