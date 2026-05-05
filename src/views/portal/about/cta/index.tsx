import Link from 'next/link';
import styles from './index.module.scss';

/**
 * CTA — About 页面底部 Call-to-Action 区域
 * Figma: 节点 545-6624 Frame 106，黑色背景
 * "Contact" 标签 + 大标题 "Join Us in Fixing Drug Discovery."
 * 底部有一个白色描边按钮（实际对应 Figma 中的 Button 组件）
 */
export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Figma: "Contact" 标签，Roboto Bold 24px，白色 */}
        <span className={styles.label}>Contact</span>

        {/* 标题 + 装饰线 */}
        <div className={styles.titleWrap}>
          {/* Figma: Roboto Serif Regular 64px，白色，斜体 "Discovery" */}
          <h2 className={styles.title}>
            Join Us in Fixing Drug{' '}
            <em className={styles.titleItalic}>Discovery</em>.
          </h2>

          {/* Figma: Vector 3 — 短横线装饰，30% 透明度 */}
          <div className={styles.titleLine} />
        </div>

        {/* Figma: Button 组件，Roboto Regular 20px，描边按钮 */}
        <Link className={styles.btn} href="/contact">
          Partner With Us
          <span className={styles.btnArrow}>
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              viewBox="0 0 30 16"
              width="30"
            >
              <path
                d="M0 8H27M27 8L20 1M27 8L20 15"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
