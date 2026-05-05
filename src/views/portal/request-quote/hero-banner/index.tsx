import styles from './index.module.scss';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      {/* 装饰性 DNA/分子图标 SVG */}
      <div className={styles.decorIcon}>
        <svg
          aria-hidden="true"
          fill="none"
          height="49"
          viewBox="0 0 64 49"
          width="64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32.25 11.28 C28 8, 20 6, 13.11 0 L35.44 11.47"
            opacity="0.3"
            stroke="white"
            strokeWidth="1"
          />
          <ellipse
            cx="32"
            cy="24"
            opacity="0.6"
            rx="10"
            ry="18"
            stroke="white"
            strokeWidth="1.2"
          />
          <ellipse
            cx="32"
            cy="24"
            opacity="0.4"
            rx="20"
            ry="12"
            stroke="white"
            strokeWidth="1"
          />
          <circle cx="32.25" cy="11.28" fill="white" opacity="0.8" r="2.5" />
          <circle cx="10.07" cy="36.16" fill="white" opacity="0.4" r="1.5" />
          <circle cx="50.58" cy="6.56" fill="white" opacity="0.4" r="1.5" />
          <circle cx="47.21" cy="6.01" fill="white" opacity="0.3" r="1" />
          <circle cx="40.06" cy="36.34" fill="white" opacity="0.3" r="1" />
        </svg>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Tell Us About Your Program.</h1>
        <p className={styles.subtitle}>
          The more detail you provide, the faster we can design a study that
          fits your needs.
        </p>
      </div>
    </section>
  );
}
