'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

/**
 * 返回目录链接：优先走浏览器历史回退（router.back()），
 * 让 Next App Router 自动恢复列表页的滚动位置；
 * 若无站内历史（如直接打开详情页）则回退为跳转 /tumor-types。
 */
export function BackLink() {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 有上一条站内历史时阻止默认跳转，改用 back() 以恢复滚动位置
    if (window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link className={styles.backLink} href="/tumor-types" onClick={handleClick}>
      <SvgIcon color="#979BA5" name="chevron-left" size={28} />
      Back to Catalog
    </Link>
  );
}
