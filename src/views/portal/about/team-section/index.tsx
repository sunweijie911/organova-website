'use client';

import Image from 'next/image';
import SafeHtml from '@/components/SafeHtml';
import styles from './index.module.scss';

/**
 * TeamSection — About 页面团队区域
 * Figma: 节点 545-6643 开始的黑色背景区域
 * 标题: "World-Class Scientists. Industry-Proven Leaders."
 * 卡片: 每行 3 个，照片 (填充) + 姓名 + 职位 + 机构
 * 点击卡片展开 fullBio (dangerouslySetInnerHTML)
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
  activeMember: number | null;
  onMemberClick: (id: number) => void;
}

/**
 * 单个成员卡片
 */
function MemberCard({
  member,
  isActive,
  onClick,
  org,
}: {
  member: TeamMember;
  isActive: boolean;
  onClick: () => void;
  org: string;
}) {
  return (
    <button
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      onClick={onClick}
      type="button"
    >
      {/* 照片区 — Figma: Rectangle 56，高度 556px，fill 铺满 */}
      <div className={styles.photoWrap}>
        {member.photo ? (
          <Image
            alt={member.name}
            className={styles.photo}
            fill
            sizes="444px"
            src={member.photo}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          /* 占位：姓名首字母 */
          <div className={styles.photoPlaceholder}>
            <span>{member.name[0]}</span>
          </div>
        )}
      </div>

      {/* 文字信息区 */}
      <div className={styles.info}>
        {/* Figma: Roboto Serif Regular 32px */}
        <h3 className={styles.name}>{member.name}</h3>

        <div className={styles.meta}>
          {/* Figma: Roboto SemiBold 16px */}
          <p className={styles.title}>{member.title}</p>
          {/* Figma: Roboto Light 14px */}
          <p className={styles.org}>{org}</p>
        </div>
      </div>

      {/* 展开时显示 fullBio */}
      {isActive && member.fullBio && (
        <SafeHtml className={styles.fullBio} html={member.fullBio} />
      )}
    </button>
  );
}

export default function TeamSection({
  tricbio,
  organova,
  activeMember,
  onMemberClick,
}: TeamSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Figma: Roboto Serif Regular 40px，白色 */}
        <h2 className={styles.sectionTitle}>
          World-Class Scientists. Industry-Proven Leaders.
        </h2>

        {/* TRiCBiO 团队 */}
        {tricbio.length > 0 && (
          <div className={styles.teamGroup}>
            <p className={styles.groupLabel}>TRiCBiO — Nanjing / Shanghai</p>
            <div className={styles.grid}>
              {tricbio.map((m) => (
                <MemberCard
                  isActive={activeMember === m.id}
                  key={m.id}
                  member={m}
                  onClick={() => onMemberClick(m.id)}
                  org="TRiCBiO (Nanjing/Shanghai)"
                />
              ))}
            </div>
          </div>
        )}

        {/* OrgaNova 团队 */}
        {organova.length > 0 && (
          <div className={styles.teamGroup}>
            <p className={styles.groupLabel}>OrgaNova — Philadelphia</p>
            <div className={styles.grid}>
              {organova.map((m) => (
                <MemberCard
                  isActive={activeMember === m.id}
                  key={m.id}
                  member={m}
                  onClick={() => onMemberClick(m.id)}
                  org="OrgaNova (Philadelphia)"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
