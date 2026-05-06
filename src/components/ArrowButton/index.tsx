'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './index.module.scss';

interface ArrowButtonProps {
  children: ReactNode;
  variant?: 'dark' | 'light';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  /** 箭头位置：'right' 默认，'left' 用于"返回"等反向操作 */
  iconPosition?: 'left' | 'right';
  /** 箭头显示模式：'hover' 默认（悬浮才显示），'always' 始终显示且与文字保持 28px 间距 */
  iconVisible?: 'hover' | 'always';
  disabled?: boolean;
}

export function ArrowButton({
  children,
  variant = 'light',
  href,
  onClick,
  type = 'button',
  className,
  iconPosition = 'right',
  iconVisible = 'hover',
  disabled,
}: ArrowButtonProps) {
  const cls = [
    styles.btn,
    styles[variant],
    iconVisible === 'always' && styles.iconAlways,
    iconPosition === 'left' && styles.iconLeft,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const arrow = (
    <span className={styles.arrowWrap}>
      <img
        alt=""
        className={styles.arrow}
        src="/portal/images/home/icons/icon-arrow-right.svg"
      />
    </span>
  );

  const inner = (
    <>
      {iconPosition === 'left' && arrow}
      <span className={styles.text}>{children}</span>
      {iconPosition === 'right' && arrow}
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
    <button className={cls} disabled={disabled} onClick={onClick} type={type}>
      {inner}
    </button>
  );
}
