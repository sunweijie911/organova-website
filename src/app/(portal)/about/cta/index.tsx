import Link from 'next/link';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

/**
 * CTA — About 页面底部 Call-to-Action 区域
 * Figma 545-6624：白底黑字，"Contact" 标签 + 大标题（Discovery 斜体）+ 56×4 装饰短横线
 * 增量：在装饰短横线右侧追加一个圆形箭头按钮，点击跳转 /contact
 */
export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* "Contact" — Roboto Bold 24px，#000 */}
        <span className={styles.label}>Contact</span>

        {/* Frame 105 — row alignItems center gap 77，标题 + 短横线 + 跳转箭头 */}
        <div className={styles.titleWrap}>
          {/* Roboto Serif Regular 64px，#000 */}
          <h2 className={styles.title}>
            Join Us in Fixing Drug{' '}
            <em className={styles.titleItalic}>Discovery</em>.
          </h2>

          {/* Vector 3 — 56×4，rgba(0,0,0,0.3) */}
          <div className={styles.titleLine} />

          {/* 圆形箭头按钮 — 跳转到联系页 */}
          <Link
            aria-label="Contact us"
            className={styles.arrowBtn}
            href="/contact"
          >
            <SvgIcon
              className={styles.arrowIcon}
              name="arrow-right"
              size={28}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
