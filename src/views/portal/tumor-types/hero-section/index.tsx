import styles from './index.module.scss';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          The World&apos;s Largest Living Cancer Biobank.
        </h1>
        <p className={styles.subtitle}>
          1,500+ deeply characterized patient-derived organoid models. 20+
          cancer types. Both PDO 1.0 and Organoid 2.0 (ALI-PDO™) formats
          available.
        </p>
      </div>
    </section>
  );
}
