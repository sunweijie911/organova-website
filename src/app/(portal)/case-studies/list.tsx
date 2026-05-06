'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import ListFiltersGrid from './list-filters-grid';
import ListHero from './list-hero';

// 列表页入口组件：只负责状态管理和数据请求，渲染交给各 section 组件
export default function CaseStudiesListView() {
  // 过滤器状态
  const [cancerType, setCancerType] = useState('All');
  const [application, setApplication] = useState('All');

  // 获取过滤选项
  const { data: options } = api.caseStudies.filterOptions.useQuery();

  // 根据当前过滤器获取列表数据
  const { data, isLoading } = api.caseStudies.list.useQuery({
    cancerType,
    application,
  });

  return (
    <>
      {/* Hero 区域：标题 + 副标题 */}
      <ListHero />

      {/* 过滤器 + 卡片网格区域 */}
      <ListFiltersGrid
        application={application}
        cancerType={cancerType}
        data={data}
        isLoading={isLoading}
        onApplicationChange={setApplication}
        onCancerTypeChange={setCancerType}
        options={options}
      />
    </>
  );
}
