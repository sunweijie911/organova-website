import styles from './index.module.scss';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
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
