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
  ctaHeading: "97% of Oncology Drugs Fail. We're Fixing the Model.",
  ctaText:
    "Preclinical success on artificial models isn't success—it's a delayed failure. We give your pipeline the biological truth it needs to reach patients.",
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
      // 视频尺寸未就绪时（height:auto 解析为 0）跳过，避免把 sticky hero 推出视口造成白屏
      if (!heroH) return;
      const vh = window.innerHeight;
      section.style.top = `${vh - heroH}px`;
    };

    update();
    window.addEventListener('resize', update);
    // 监听 section 高度变化：SPA 切回首页时视频重新加载，高度确定后再重算 top
    const ro = new ResizeObserver(update);
    ro.observe(section);
    return () => {
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, []);

  return (
    <section className={styles.hero} id="home-hero" ref={sectionRef}>
      <video
        autoPlay
        className={styles.bgVideo}
        loop
        muted
        playsInline
        poster="/assets/video/banner-poster.webp"
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
          <div className={styles.introGroup}>
            <p className={styles.subtitle}>{HERO.subtitle}</p>
            <p className={styles.description}>{HERO.description}</p>
          </div>
          <div className={styles.ctaGroup}>
            <p className={styles.ctaHeading}>{HERO.ctaHeading}</p>
            <p className={styles.ctaText}>{HERO.ctaText}</p>
            <div className={styles.buttons}>
              {HERO.buttons.map((btn) => (
                <ArrowButton href={btn.href} key={btn.label} variant="dark">
                  {btn.label}
                </ArrowButton>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomGradient} />
    </section>
  );
}
