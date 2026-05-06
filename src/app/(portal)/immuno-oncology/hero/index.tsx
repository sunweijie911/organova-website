import Image from 'next/image';
import styles from './index.module.scss';

export default function ImmunoOncologyHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          alt=""
          fill
          priority
          src="/assets/images/immuno-oncology/hero-bg.png"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          Your I-O Drug Needs an Immune System to Fight.
        </h1>
        <p className={styles.subtitle}>
          Testing an immunotherapy in a model without immune cells is not a
          preclinical study—it&apos;s a hypothesis with no data. We provide the
          missing battlefield.
        </p>
      </div>
    </section>
  );
}
