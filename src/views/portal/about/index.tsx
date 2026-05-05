'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import CTA from './cta';
import HeroBanner from './hero-banner';
import OurStory from './our-story';
import TeamSection from './team-section';
import Timeline from './timeline';

/**
 * AboutView — About 页面主视图
 * 按 Figma 设计拆分为独立 section 组件
 * 共享状态（storyExpanded / activeMember）在此管理，通过 props 传入子组件
 */
export default function AboutView() {
  // 故事展开状态
  const [storyExpanded, setStoryExpanded] = useState(false);
  // 当前激活的团队成员 id（点击展开 fullBio）
  const [activeMember, setActiveMember] = useState<number | null>(null);

  // 团队数据
  const { data: team } = api.team.list.useQuery();

  /**
   * 切换成员展开状态：再次点击同一成员则收起
   */
  const handleMemberClick = (id: number) => {
    setActiveMember((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Hero 区域 — 深色背景，大标题 */}
      <HeroBanner />

      {/* Our Story — 白色背景，三列故事卡片，可展开 */}
      <OurStory
        onToggle={() => setStoryExpanded((v) => !v)}
        storyExpanded={storyExpanded}
      />

      {/* Team — 黑色背景，成员卡片网格，点击展开 fullBio */}
      <TeamSection
        activeMember={activeMember}
        onMemberClick={handleMemberClick}
        organova={team?.organova ?? []}
        tricbio={team?.tricbio ?? []}
      />

      {/* Timeline — 黑色背景，里程碑时间线 */}
      <Timeline />

      {/* CTA — 黑色背景，行动号召 */}
      <CTA />
    </>
  );
}
