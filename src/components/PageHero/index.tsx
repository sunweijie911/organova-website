import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './index.module.scss';

interface PageHeroProps {
  /** 背景图片路径，例如 /assets/images/.../hero-bg.png */
  bgSrc: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** 额外内容（按钮、tab 等），渲染于副标题下方 */
  children?: ReactNode;
  /** 标题→副标题间距（默认 80px） */
  titleGap?: number;
  /** 副标题→children 间距（默认 80px） */
  subtitleGap?: number;
  /** 内容定位：top（默认 padding-top:401px）或 bottom（贴底，padding-bottom:395px） */
  align?: 'top' | 'bottom';
  /** 自定义类名，附加到 section 上 */
  className?: string;
}

/**
 * 门户深色图片 Hero —— biotech / immuno-oncology / pharma-solutions / tumor-types 共用模板。
 * - 1079px 高、黑底、图片填充 + 径向遮罩
 * - Roboto Serif 64px 白色标题 + Roboto 24px 白色副标题
 * - 内容区 padding-top 401px，与 Figma 设计稿一致
 */
export function PageHero({
  bgSrc,
  title,
  subtitle,
  children,
  titleGap,
  subtitleGap,
  align = 'top',
  className,
}: PageHeroProps) {
  return (
    <section
      className={[
        styles.hero,
        align === 'bottom' ? styles.alignBottom : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--page-hero-title-gap': titleGap != null ? `${titleGap}px` : '',
          '--page-hero-subtitle-gap':
            subtitleGap != null ? `${subtitleGap}px` : '',
        } as React.CSSProperties
      }
    >
      <Image alt="" className={styles.bg} fill priority src={bgSrc} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children && <div className={styles.extra}>{children}</div>}
      </div>
    </section>
  );
}
