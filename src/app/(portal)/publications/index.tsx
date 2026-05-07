'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { api } from '@/lib/trpc/react';

import HeroBanner, { type PublicationsTab } from './hero-banner';
import NewsSection from './news-section';
import PublicationsList from './publications-list';
import ResourcesSection from './resources-section';

const VALID_TABS: PublicationsTab[] = ['publications', 'resources', 'news'];

function parseTab(value: string | null): PublicationsTab {
  if (value && (VALID_TABS as string[]).includes(value)) {
    return value as PublicationsTab;
  }
  return 'publications';
}

/**
 * Publications 入口：单页 + URL query 控制 Tab
 * URL: /publications?tab=publications|resources|news（缺省 publications）
 */
export default function PublicationsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseTab(searchParams.get('tab'));

  const [year, setYear] = useState<number | undefined>();

  const { data: pubs } = api.publications.list.useQuery();
  const { data: newsItems } = api.news.list.useQuery({ year });
  const { data: years } = api.news.availableYears.useQuery();
  const { data: resources } = api.resources.list.useQuery();

  const handleTabChange = (tab: PublicationsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'publications') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    const qs = params.toString();
    router.replace(qs ? `/publications?${qs}` : '/publications', {
      scroll: false,
    });
  };

  return (
    <>
      <BrandLogo />
      <HeroBanner activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'publications' && <PublicationsList publications={pubs} />}

      {activeTab === 'resources' && <ResourcesSection resources={resources} />}

      {activeTab === 'news' && (
        <NewsSection
          newsItems={newsItems}
          onYearChange={setYear}
          selectedYear={year}
          years={years}
        />
      )}
    </>
  );
}
