'use client';

import { useEffect, useRef } from 'react';
import { PortalNav } from '@/components/PortalNav';
import styles from './index.module.scss';

export function PortalStickyNav() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const isVisible = useRef(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    lastScrollY.current = window.scrollY;

    const isFooterVisible = () => {
      const footer = document.getElementById('site-footer');
      const rect = footer?.getBoundingClientRect();
      return rect ? rect.top < window.innerHeight : false;
    };

    const apply = (nextVisible: boolean) => {
      if (nextVisible === isVisible.current) return;
      isVisible.current = nextVisible;
      if (styles.visible) {
        el.classList.toggle(styles.visible, nextVisible);
      }
      document.documentElement.style.setProperty(
        '--sticky-nav-height',
        nextVisible ? '114px' : '0px',
      );
    };

    // 初始状态
    apply(!isFooterVisible());

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY.current;
      const footerVisible = isFooterVisible();
      const nextVisible =
        !footerVisible && (currentScrollY === 0 || scrollingUp);
      apply(nextVisible);
      lastScrollY.current = currentScrollY;
    };

    const handleResize = () => {
      const footerVisible = isFooterVisible();
      const nextVisible =
        !footerVisible && (window.scrollY === 0 || isVisible.current);
      apply(nextVisible);
    };

    const ro = new ResizeObserver(handleResize);
    const main = document.querySelector('main');
    if (main) ro.observe(main);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <PortalNav />
    </div>
  );
}
