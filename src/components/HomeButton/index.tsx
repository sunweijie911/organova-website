'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './index.module.scss';

interface HomeButtonProps {
  children: ReactNode;
  variant?: 'dark' | 'light';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function HomeButton({
  children,
  variant = 'light',
  href,
  onClick,
  type = 'button',
  className,
}: HomeButtonProps) {
  const cls = [styles.btn, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span className={styles.text}>{children}</span>
      <span className={styles.arrowWrap}>
        <img
          alt=""
          className={styles.arrow}
          src="/portal/images/home/icons/icon-arrow-right.svg"
        />
      </span>
    </>
  );

  if (href) {
    return (
      <Link className={cls} href={href}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={cls} onClick={onClick} type={type}>
      {inner}
    </button>
  );
}
