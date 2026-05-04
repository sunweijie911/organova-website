import { HomeButton } from '@/components/HomeButton';
import styles from './index.module.scss';

export default function TrustedPartners() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Trusted by Global Leaders in Drug Development.
      </h2>
      <div className={styles.logos}>
        <img
          alt="Eli Lilly"
          className={styles.logo1}
          src="/portal/images/home/partners/partner-lilly.png"
        />
        <img
          alt="Pharmaron"
          className={styles.logo2}
          src="/portal/images/home/partners/partner-2.png"
        />
      </div>
      <p className={styles.disclaimer}>
        *Logos displayed with permission. Partner names used for reference only.
      </p>
      <h2 className={styles.subTitle}>Your Drug Deserves a Better Model.</h2>
      <HomeButton className={styles.btn} href="/request-quote">
        Request a Consultation
      </HomeButton>
    </section>
  );
}
