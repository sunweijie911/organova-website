import Link from 'next/link';
import styles from './index.module.scss';

export default function Cta() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Let&apos;s Build the Science Together.</h2>
        <Link className={styles.button} href="/contact">
          Start a Conversation
        </Link>
      </div>
    </section>
  );
}
