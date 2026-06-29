'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import SafeHtml from '@/components/SafeHtml';
import styles from './dialog.module.scss';

/**
 * TeamMemberDialog — 团队成员卡片弹窗
 * Figma 581-11589：1920×1080 白底全屏覆盖
 * 左：姓名/职位/机构 + 短简介 + 长简介；右：照片 543×817；右上：Close 按钮
 */

export interface DialogMember {
  id: number;
  name: string;
  title: string;
  photo: string | null;
  shortBio: string | null;
  fullBio: string | null;
  org: string;
}

interface DialogProps {
  member: DialogMember;
  onClose: () => void;
}

const PLACEHOLDER_PHOTO = '/assets/images/about/team-placeholder.webp';

export default function TeamMemberDialog({ member, onClose }: DialogProps) {
  // Esc 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    // 用 button 作为可点击的关闭背板，配合 ESC 键，满足 a11y
    <div aria-modal="true" className={styles.overlay} role="dialog">
      <button
        aria-label="Close"
        className={styles.backdrop}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div className={styles.card}>
        {/* 右上 Close 按钮 — 纯文字按钮（无图标） */}
        <button
          aria-label="Close"
          className={styles.closeBtn}
          onClick={onClose}
          type="button"
        >
          Close
        </button>

        {/* 左侧文字内容 */}
        <div className={styles.left}>
          {/* Frame 86 — column gap 16，宽 444 */}
          <div className={styles.header}>
            {/* Roboto Serif Regular 32px */}
            <h2 className={styles.name}>{member.name}</h2>
            {/* Frame 85 — column gap 8 */}
            <div className={styles.meta}>
              <p className={styles.title}>{member.title}</p>
              <p className={styles.org}>{member.org}</p>
            </div>
          </div>

          {/* 短简介 — Roboto Regular 32px，宽 636 */}
          {member.shortBio && (
            <p className={styles.shortBio}>{member.shortBio}</p>
          )}

          {/* 长简介 — Roboto Light 18px，宽 636 */}
          {member.fullBio && (
            <SafeHtml className={styles.fullBio} html={member.fullBio} />
          )}
        </div>

        {/* 右侧照片 — Figma: 543×817 */}
        <div className={styles.photoWrap}>
          <Image
            alt={member.name}
            className={styles.photo}
            fill
            sizes="(max-width: 1200px) 50vw, 543px"
            src={member.photo || PLACEHOLDER_PHOTO}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}
