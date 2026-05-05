'use client';

import Link from 'next/link';
import { usePortalLayout } from '@/context/portal-layout-context';
import { authClient } from '@/lib/auth-client';
import styles from './index.module.scss';

const UTILITY_LINKS = [
  { label: 'BIOBANK DATABASE LOGIN', href: '/tumor-types' },
  { label: 'BIOSPECIMEN REQUEST', href: '/request-quote' },
  { label: 'REQUEST A QUOTE', href: '/request-quote' },
  { label: 'CONTACT US', href: '/contact' },
];

export function PortalHeader() {
  const { layoutVisible } = usePortalLayout();
  const { data: session } = authClient.useSession();

  if (!layoutVisible.header) return null;

  return (
    <div className={styles.header}>
      <div aria-label="OrgaNova" className={styles.logo} role="img" />
      <div className={styles.menu}>
        {UTILITY_LINKS.map((link) => (
          <Link className={styles.link} href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
        {session?.user ? (
          <button
            className={styles.authBtn}
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = '/';
                  },
                },
              })
            }
            type="button"
          >
            SIGN OUT
          </button>
        ) : (
          <Link className={styles.link} href="/signin">
            LOGIN
          </Link>
        )}
      </div>
    </div>
  );
}
