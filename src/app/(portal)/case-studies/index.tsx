'use client';

import { useMemo, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';
import ListFiltersGrid from './list-filters-grid';
import ListHero from './list-hero';

// 列表页入口：客户端拉全量后过滤+计数
export default function CaseStudiesListView() {
  const [cancerType, setCancerType] = useState('All');
  const [application, setApplication] = useState('All');

  const { data: options } = api.caseStudies.filterOptions.useQuery();
  const { data: allData, isLoading } = api.caseStudies.list.useQuery();

  const filtered = useMemo(() => {
    if (!allData) return undefined;
    return allData.filter((cs) => {
      if (cancerType !== 'All' && !cs.cancerTypeTags.includes(cancerType))
        return false;
      if (application !== 'All' && !cs.applicationTags.includes(application))
        return false;
      return true;
    });
  }, [allData, cancerType, application]);

  // 各标签下的数量（基于全量数据，与当前选择无关）
  const counts = useMemo(() => {
    const cancer: Record<string, number> = {};
    const app: Record<string, number> = {};
    if (allData) {
      for (const cs of allData) {
        for (const t of cs.cancerTypeTags) cancer[t] = (cancer[t] ?? 0) + 1;
        for (const t of cs.applicationTags) app[t] = (app[t] ?? 0) + 1;
      }
    }
    return { cancer, app };
  }, [allData]);

  return (
    <>
      {/* 顶部黑底容器：包住 BrandLogo + Hero，避免 BrandLogo 上方出现白色条 */}
      <div className={styles.page}>
        <BrandLogo variant="dark" />
        <ListHero />
      </div>

      <ListFiltersGrid
        application={application}
        cancerType={cancerType}
        counts={counts}
        data={filtered}
        isLoading={isLoading}
        onApplicationChange={setApplication}
        onCancerTypeChange={setCancerType}
        options={options}
        totalCount={allData?.length ?? 0}
      />
    </>
  );
}
