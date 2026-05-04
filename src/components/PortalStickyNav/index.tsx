'use client';

import { useEffect, useRef, useState } from 'react';
import { PortalNav } from '@/components/PortalNav';
import styles from './index.module.scss';

export function PortalStickyNav() {
  const [visible, setVisible] = useState(true);
  const [bottom, setBottom] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY.current;

      const footer = document.getElementById('site-footer');
      const footerRect = footer?.getBoundingClientRect();
      const footerOverlap = footerRect
        ? Math.max(0, Math.floor(window.innerHeight - footerRect.top))
        : 0;

      setBottom(footerOverlap);

      if (footerOverlap > 0 || currentScrollY === 0 || scrollingUp) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${visible ? styles.visible : ''}`}
      style={{ bottom }}
    >
      <PortalNav />
    </div>
  );
}
