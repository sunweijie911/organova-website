'use client';

import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { api } from '@/lib/trpc/react';
import CTA from './cta';
import HeroBanner from './hero-banner';
import styles from './index.module.scss';
import OurStory from './our-story';
import OurStoryDialog from './our-story/dialog';
import TeamSection from './team-section';
import TeamMemberDialog, { type DialogMember } from './team-section/dialog';
import Timeline from './timeline';

export default function AboutView() {
  // Our Story 完整故事弹窗开关
  const [storyOpen, setStoryOpen] = useState(false);
  // 当前打开弹窗的成员（带分组信息）
  const [activeMember, setActiveMember] = useState<DialogMember | null>(null);

  const { data: team } = api.team.list.useQuery();

  // 任一弹窗打开时禁用 body 滚动（底层页面保持原位，关闭后滚动位置不变）
  useEffect(() => {
    if (!activeMember && !storyOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeMember, storyOpen]);

  return (
    <div className={styles.page}>
      <BrandLogo bg="dark" />

      <HeroBanner />

      <OurStory onReadFullStory={() => setStoryOpen(true)} />

      <TeamSection
        onMemberClick={setActiveMember}
        organova={team?.organova ?? []}
        tricbio={team?.tricbio ?? []}
      />

      <Timeline />

      <CTA />

      {storyOpen && <OurStoryDialog onClose={() => setStoryOpen(false)} />}

      {activeMember && (
        <TeamMemberDialog
          member={activeMember}
          onClose={() => setActiveMember(null)}
        />
      )}
    </div>
  );
}
