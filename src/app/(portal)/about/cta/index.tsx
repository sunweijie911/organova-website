import Link from 'next/link';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

/**
 * CTA — About 页面底部 Call-to-Action 区域
 * Figma 1203-10641：白底黑字，"Contact" 标签 + 大标题（Discovery 斜体）
 * 标题右侧为一个灰色细线右箭头（#979BA5，~80px），点击跳转 /contact
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
            Join Us in Fixing Drug
            <br />
            <em className={styles.titleItalic}>Discovery</em>.
          </h2>

          {/* 灰色细线右箭头 — 跳转到联系页 */}
          <Link
            aria-label="Contact us"
            className={styles.arrowLink}
            href="/contact"
          >
            <SvgIcon
              className={styles.arrowIcon}
              height={44}
              name="arrow-thin-right"
              width={72}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
