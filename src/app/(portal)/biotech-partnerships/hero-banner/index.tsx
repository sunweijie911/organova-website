import Image from 'next/image';
import styles from './index.module.scss';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <Image
        alt=""
        className={styles.bg}
        fill
        priority
        src="/assets/images/biotech-partnerships/hero-bg-ad2606.png"
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          We Don&apos;t Just Run Your Assay. {'\n'}We Build Your Science.
        </h1>
        <p className={styles.subtitle}>
          For biotech companies that need more than a CRO—a scientific partner
          who understands your biology and shares your ambition.
        </p>
      </div>
    </section>
  );
}
