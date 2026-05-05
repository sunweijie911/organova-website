import Image from 'next/image';
import { HomeButton } from '@/components/HomeButton';
import styles from './index.module.scss';

export default function PharmaSolutionsHero() {
  return (
    <section className={styles.hero}>
      <Image
        alt=""
        className={styles.heroBg}
        fill
        priority
        src="/portal/images/pharma-solutions/hero-bg.png"
      />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Your Drug Works. Your Model Is Lying.
        </h1>
        <p className={styles.heroSubtitle}>
          Preclinical success on artificial models isn't success—it's a delayed
          failure. We provide the biological truth needed to make confident
          go/no-go decisions.
        </p>
        <HomeButton href="/contact" variant="dark">
          Discuss Your Program
        </HomeButton>
      </div>
    </section>
  );
}
