import styles from './index.module.scss';

// 列表页 Hero 区域
// Figma 节点：581:10262（标题）、581:10263（副标题）
// 背景色 #1A1A1A，Hero 内容左对齐
export default function ListHero() {
  return (
    <section className={styles.hero}>
      {/* 右侧装饰光晕 */}
      <div aria-hidden="true" className={styles.glow} />

      <div className={styles.inner}>
        <h1 className={styles.title}>
          From Biological Question to Clinical Insight.
        </h1>
        <p className={styles.subtitle}>
          Explore real-world examples of how our platform is helping partners
          overcome their toughest preclinical challenges.
        </p>
      </div>
    </section>
  );
}
