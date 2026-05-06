import Image from 'next/image';
import { BrandLogo } from '@/components/BrandLogo';
import styles from './index.module.scss';

export default function PlatformHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          alt=""
          fill
          priority
          src="/assets/images/platform/hero-bg.png"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>
      <div className={styles.overlay} />
      <BrandLogo className={styles.brandLogo} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          The World&apos;s Most Clinically-Relevant Preclinical Model.
        </h1>
        <p className={styles.subtitle}>
          Our Organoid 2.0 (ALI-PDO™) platform is the first to preserve the
          native tumor microenvironment at scale, providing an unprecedented
          window into human cancer biology.
        </p>
      </div>
    </section>
  );
}
