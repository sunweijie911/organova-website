'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { canGoBackInApp } from '@/context/portal-layout-context';

interface Props {
  className?: string;
  children: ReactNode;
}

/**
 * 返回 News 列表链接：优先走浏览器历史回退（router.back()），
 * 让 Next App Router 自动恢复列表页（/publications?tab=news）的滚动位置；
 * 若无站内历史（如直接打开详情页）则回退为跳转 /publications?tab=news。
 */
export function BackLink({ className, children }: Props) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 有上一条站内历史时阻止默认跳转，改用 back() 以恢复滚动位置
    if (canGoBackInApp()) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      className={className}
      href="/publications?tab=news"
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
