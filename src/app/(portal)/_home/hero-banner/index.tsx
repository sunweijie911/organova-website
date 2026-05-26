'use client';

import { useEffect, useRef } from 'react';
import { ArrowButton } from '@/components/ArrowButton';
import styles from './index.module.scss';

const HERO = {
  title: {
    line1: 'Preclinical Human Models',
    line2: 'Organoid2.0',
  },
  subtitle:
    'Functional 3D tissue models that preserve the native microenvironment for translational research',
  description: 'Human biospecimens • Tissue arrays • Organoid biobank',
  buttons: [
    { label: 'Discover Our Platform', href: '/platform' },
    { label: 'Explore Case Studies', href: '/case-studies' },
  ],
};

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.3) {
        video.currentTime = 0;
      }
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const heroH = section.offsetHeight;
      const vh = window.innerHeight;
      section.style.top = `${vh - heroH}px`;
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <section className={styles.hero} id="home-hero" ref={sectionRef}>
      <video
        autoPlay
        className={styles.bgVideo}
        loop
        muted
        playsInline
        preload="auto"
        ref={videoRef}
        src="/assets/video/banner.mp4"
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.titleItalic}>{HERO.title.line1}</span>
          <span className={styles.titleBold}>{HERO.title.line2}</span>
        </h1>
        <div className={styles.textGroup}>
          <p className={styles.subtitle}>{HERO.subtitle}</p>
          <p className={styles.description}>{HERO.description}</p>
          <div className={styles.buttons}>
            {HERO.buttons.map((btn) => (
              <ArrowButton href={btn.href} key={btn.label} variant="dark">
                {btn.label}
              </ArrowButton>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.bottomGradient} />
    </section>
  );
}
