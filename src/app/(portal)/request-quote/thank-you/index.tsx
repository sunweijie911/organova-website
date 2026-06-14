import Link from 'next/link';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

export default function ThankYou() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.head}>
          {/* 成功对勾 —— Figma 圆-对 120×120 #313238 */}
          <svg
            aria-hidden="true"
            className={styles.checkIcon}
            fill="none"
            height="120"
            viewBox="0 0 120 120"
            width="120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M60 7.5C88.9922 7.5 112.5 31.0078 112.5 60C112.5 88.9922 88.9922 112.5 60 112.5C31.0078 112.5 7.5 88.9922 7.5 60C7.5 31.0078 31.0078 7.5 60 7.5ZM82.5107 41.25L52.5144 71.25L37.5 56.25L31.875 61.8848L52.5144 82.5L88.125 46.875L82.5107 41.25Z"
              fill="#313238"
              fillRule="evenodd"
            />
          </svg>

          <div className={styles.copy}>
            <div className={styles.lead}>
              <h1 className={styles.title}>Thank You.</h1>
              <p className={styles.message}>
                We&apos;ve received your project brief. A member of our
                scientific team will review your program details and reach out
                within two business days.
              </p>
            </div>
            <p className={styles.confirmation}>
              A confirmation has been sent to your email address.
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link className={styles.btnOutline} href="/">
            Back To Home
          </Link>
          <Link className={styles.btnSolid} href="/tumor-types">
            Explore Our Biobank
            <SvgIcon color="#fff" name="arrow-right" size={24} />
          </Link>
        </div>
      </div>
    </section>
  );
}
