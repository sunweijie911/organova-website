'use client';

import Link from 'next/link';
import styles from './index.module.scss';

const NAV_LINKS = [
  { label: 'OUR PLATFORM', href: '/platform' },
  { label: 'TUMOR TYPES', href: '/tumor-types' },
  { label: 'PHARMA SOLUTIONS', href: '/pharma-solutions' },
  { label: 'IMMUNO-ONCOLOGY', href: '/immuno-oncology' },
  { label: 'BIOTECH PARTNERSHIPS', href: '/biotech-partnerships' },
  { label: 'CASE STUDIES', href: '/case-studies' },
  { label: 'PUBLICATIONS & RESOURCES', href: '/publications' },
  { label: 'FAQ', href: '/faq' },
  { label: 'ABOUT', href: '/about' },
];

interface PortalNavProps {
  className?: string;
}

export function PortalNav({ className }: PortalNavProps) {
  return (
    <div className={`${styles.nav} ${className ?? ''}`}>
      <Link className={styles.logoLink} href="/">
        <img
          alt="OrgaNova"
          className={styles.logoImg}
          src="/assets/icons/logo-light.svg"
        />
      </Link>
      <nav className={styles.navList}>
        {NAV_LINKS.map((link) => (
          <Link className={styles.navItem} href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
