import styles from './index.module.scss';

/**
 * HeroBanner — About 页面 Hero 区域
 * 深色背景 (#000)，左下对齐的大标题 + 副标题
 * 与 Figma 节点 545-6619 顶部区域对应
 */
export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      {/* 右侧背景装饰矩形 */}
      <div className={styles.bgRect} />

      <div className={styles.content}>
        <h1 className={styles.title}>
          Why do so many promising cancer drugs fail?
        </h1>
        <p className={styles.subtitle}>
          We started with a question that has defined our mission: to build a
          preclinical model that finally reflects human biology.
        </p>
      </div>
    </section>
  );
}
