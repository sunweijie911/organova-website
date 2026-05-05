'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';

import HeroBanner from './hero-banner';
import NewsSection from './news-section';
import PublicationsList from './publications-list';
import ResourcesSection from './resources-section';

/**
 * Publications 页面入口
 * 仅负责数据请求和 year 状态管理，UI 由各 section 子组件承接

 */
export default function PublicationsView() {
  // year 过滤状态：undefined 表示 "All Years"
  const [year, setYear] = useState<number | undefined>();

  // 数据请求
  const { data: pubs } = api.publications.list.useQuery();
  const { data: newsItems } = api.news.list.useQuery({ year });
  const { data: years } = api.news.availableYears.useQuery();
  const { data: resources } = api.resources.list.useQuery();

  return (
    <>
      {/* Hero 区域：标题 + tab nav + 描述文字 */}
      <HeroBanner />

      {/* Publications 列表：两列卡片，含占位图 + 论文信息 */}
      <PublicationsList publications={pubs} />

      {/* News 区域：year filter + 两列新闻条目 */}
      <NewsSection
        newsItems={newsItems}
        onYearChange={setYear}
        selectedYear={year}
        years={years}
      />

      {/* Resources 区域：3列资源卡片 */}
      <ResourcesSection resources={resources} />
    </>
  );
}
