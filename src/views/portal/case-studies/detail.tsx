'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/trpc/react';
import styles from './detail.module.scss';
import DetailBody from './detail-body';
import DetailHero from './detail-hero';

// 详情页入口组件：只负责数据请求，渲染交给各 section 组件
export default function CaseStudyDetailView() {
  const params = useParams<{ id: string }>();

  const { data, isLoading } = api.caseStudies.getBySlug.useQuery({
    slug: params.id,
  });

  // 加载状态
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // 未找到
  if (!data) {
    return (
      <div className={styles.notFound}>
        Case study not found.{' '}
        <Link href="/case-studies">← Back to Gallery</Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero 区域：Back 链接 + 标题 + 标签 */}
      <DetailHero
        applicationTags={data.applicationTags}
        cancerTypeTags={data.cancerTypeTags}
        summary={data.summary}
        title={data.title}
      />

      {/* 正文 + 侧边栏区域 */}
      <DetailBody
        approach={data.approach}
        challenge={data.challenge}
        cta1Label={data.cta1Label}
        cta1Url={data.cta1Url}
        cta2Label={data.cta2Label}
        cta2Url={data.cta2Url}
        implication={data.implication}
        metaDrugClasses={data.metaDrugClasses}
        metaModel={data.metaModel}
        metaReadout={data.metaReadout}
        metaValidation={data.metaValidation}
        results={data.results}
      />
    </>
  );
}
