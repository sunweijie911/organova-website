import { BrandLogo } from '@/components/BrandLogo';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import styles from './index.module.scss';

export default function ContactView() {
  return (
    <section className={styles.contactSection}>
      <BrandLogo />
      <div className={styles.contactContent}>
        <h1 className={styles.contactTitle}>Contact</h1>
        <div className={styles.contentLayout}>
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
