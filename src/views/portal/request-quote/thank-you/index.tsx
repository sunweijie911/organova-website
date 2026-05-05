import styles from './index.module.scss';

export default function ThankYou() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        {/* 成功图标 */}
        <div className={styles.iconWrapper}>
          <svg
            aria-hidden="true"
            fill="none"
            height="64"
            viewBox="0 0 64 64"
            width="64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <path
              d="M20 32l9 9 15-18"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Thank You.</h1>
        <p className={styles.message}>
          A member of our scientific team will contact you within 1 business
          day.
        </p>
      </div>
    </section>
  );
}
