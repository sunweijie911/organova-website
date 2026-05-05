'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import FaqContent from './faq-content';
import HeroBanner from './hero-banner';

// FAQ 默认激活分类
const DEFAULT_CATEGORY = 'About Our Technology';

export default function FaqView() {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const { data, isLoading } = api.faq.listWithItems.useQuery();

  return (
    <>
      {/* Hero 区域：标题 + 分类导航 tab */}
      <HeroBanner
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* FAQ 内容区：accordion 列表 */}
      <FaqContent
        activeCategory={activeCategory}
        data={data}
        isLoading={isLoading}
      />
    </>
  );
}
