import styles from './index.module.scss';

/**
 * Hero Banner 区域
 * 对应 Figma 节点 545-6055
 * 白色背景，Roboto Serif 64px 大标题，下方 tab 导航，Roboto 24px 描述文字
 */
export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* 主标题：Roboto Serif 64px */}
        <h1 className={styles.title}>The Science Behind the Platform.</h1>

        {/* tab 导航：Key Publications / Resources for Your Research / News */}
        <nav aria-label="页面导航" className={styles.tabNav}>
          <a className={styles.tabActive} href="#publications">
            Key Publications
          </a>
          <a className={styles.tabLink} href="#resources">
            Resources for Your Research
          </a>
          <a className={styles.tabLink} href="#news">
            News
          </a>
        </nav>

        {/* 描述文字：Roboto Regular 24px */}
        <p className={styles.subtitle}>
          Our technology is grounded in over a decade of peer-reviewed research.
          Explore the publications that form the scientific foundation of our
          platform.
        </p>
      </div>
    </section>
  );
}
