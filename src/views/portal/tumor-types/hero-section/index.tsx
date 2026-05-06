import Image from 'next/image';
import styles from './index.module.scss';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          alt=""
          fill
          priority
          src="/portal/images/tumor-types/hero-bg.png"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>
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
