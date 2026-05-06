'use client';

import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { api } from '@/lib/trpc/react';
import CTA from './cta';
import HeroBanner from './hero-banner';
import styles from './index.module.scss';
import OurStory from './our-story';
import TeamSection from './team-section';
import TeamMemberDialog, { type DialogMember } from './team-section/dialog';
import Timeline from './timeline';

export default function AboutView() {
  // Our Story 展开态
  const [storyExpanded, setStoryExpanded] = useState(false);
  // 当前打开弹窗的成员（带分组信息）
  const [activeMember, setActiveMember] = useState<DialogMember | null>(null);

  const { data: team } = api.team.list.useQuery();

  // 弹窗打开时禁用 body 滚动
  useEffect(() => {
    if (!activeMember) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeMember]);

  return (
    <div className={styles.page}>
      <BrandLogo variant="dark" />

      <HeroBanner />

      <OurStory
        expanded={storyExpanded}
        onToggle={() => setStoryExpanded((v) => !v)}
      />

      <TeamSection
        onMemberClick={setActiveMember}
        organova={team?.organova ?? []}
        tricbio={team?.tricbio ?? []}
      />

      <Timeline />

      <CTA />

      {activeMember && (
        <TeamMemberDialog
          member={activeMember}
          onClose={() => setActiveMember(null)}
        />
      )}
    </div>
  );
}
