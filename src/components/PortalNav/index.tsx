'use client';

import Link from 'next/link';
import styles from './index.module.scss';

const NAV_LINKS = [
  { label: 'OUR PLATFORM', href: '#' },
  { label: 'TUMOR TYPES', href: '#' },
  { label: 'PHARMA SOLUTIONS', href: '#' },
  { label: 'IMMUNO-ONCOLOGY', href: '#' },
  { label: 'BIOTECH PARTNERSHIPS', href: '#' },
  { label: 'CASE STUDIES', href: '#' },
  { label: 'MEDIA CENTER', href: '#' },
  { label: 'ABOUT', href: '/about-us' },
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
          src="/portal/images/home/logo.svg"
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
