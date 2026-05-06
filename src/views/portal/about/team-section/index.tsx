'use client';

import Image from 'next/image';
import type { DialogMember } from './dialog';
import styles from './index.module.scss';

/**
 * TeamSection — About 页面团队区域
 * Figma 545-6643 起：白底黑字（白色矩形 y=2159 之后区域）
 * 9 张卡片以 3 行 × 3 列展示，gap 列 54 行 77，照片 444×556（≈4:5）
 * 点击卡片打开全屏弹窗（详见 ./dialog）
 */

interface TeamMember {
  id: number;
  name: string;
  title: string;
  photo: string | null;
  shortBio: string | null;
  fullBio: string | null;
}

interface TeamSectionProps {
  tricbio: TeamMember[];
  organova: TeamMember[];
  onMemberClick: (m: DialogMember) => void;
}

const PLACEHOLDER_PHOTO = '/portal/images/about/team-placeholder.png';

function MemberCard({
  member,
  org,
  onClick,
}: {
  member: TeamMember;
  org: string;
  onClick: () => void;
}) {
  return (
    <button className={styles.card} onClick={onClick} type="button">
      {/* 照片 — Figma: Rectangle 56，宽 444 高 556，cover */}
      <div className={styles.photoWrap}>
        <Image
          alt={member.name}
          className={styles.photo}
          fill
          sizes="(max-width: 1200px) 33vw, 444px"
          src={member.photo || PLACEHOLDER_PHOTO}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Frame 86 — column gap 16px */}
      <div className={styles.info}>
        {/* Roboto Serif Regular 32px */}
        <h3 className={styles.name}>{member.name}</h3>

        {/* Frame 85 — column gap 8px */}
        <div className={styles.meta}>
          {/* Roboto SemiBold 16px */}
          <p className={styles.title}>{member.title}</p>
          {/* Roboto Light 14px */}
          <p className={styles.org}>{org}</p>
        </div>
      </div>
    </button>
  );
}

export default function TeamSection({
  tricbio,
  organova,
  onMemberClick,
}: TeamSectionProps) {
  const buildClickHandler = (member: TeamMember, org: string) => () =>
    onMemberClick({ ...member, org });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Roboto Serif Regular 40px，#000，宽 942 */}
        <h2 className={styles.sectionTitle}>
          World-Class Scientists. Industry-Proven Leaders.
        </h2>

        <div className={styles.grid}>
          {tricbio.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onClick={buildClickHandler(m, 'TRiCBiO (Nanjing/Shanghai)')}
              org="TRiCBiO (Nanjing/Shanghai)"
            />
          ))}
          {organova.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onClick={buildClickHandler(m, 'OrgaNova (Philadelphia)')}
              org="OrgaNova (Philadelphia)"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
