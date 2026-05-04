'use client';

import { useEffect, useRef } from 'react';
import { HomeButton } from '@/components/HomeButton';
import styles from './index.module.scss';

const HERO = {
  title: 'Decoding Cancer',
  subtitle: "97% of Oncology Drugs Fail. We're Fixing the Model.",
  description:
    "Preclinical success on artificial models isn't success—it's a delayed failure. We give your pipeline \n the biological truth it needs to reach patients.",
  buttons: [
    { label: 'Discover Our Platform', href: '/platform' },
    { label: 'Explore Case Studies', href: '/case-studies' },
  ],
};

const SCROLL_RANGE = 700;
const SPEED = 1.3;

export default function HeroBanner() {
  const outerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);

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
    const viewportH = window.innerHeight - 60;

    const animate = () => {
      const relY = Math.max(
        0,
        window.scrollY - (outerRef.current?.offsetTop ?? 0),
      );
      if (relY > SCROLL_RANGE) return;

      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${-relY * SPEED}px)`;
      }
      if (textGroupRef.current) {
        const offset = Math.max(0, viewportH - relY * SPEED);
        textGroupRef.current.style.transform = `translateY(${offset}px)`;
      }
    };

    animate();
    window.addEventListener('scroll', animate, { passive: true });
    return () => window.removeEventListener('scroll', animate);
  }, []);

  return (
    <div className={styles.heroOuter} ref={outerRef}>
      <section className={styles.hero} id="home-hero">
        <video
          autoPlay
          className={styles.bgWrapper}
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          src="/portal/video/banner.mp4"
        />
        <h2 className={styles.title} ref={titleRef}>
          {HERO.title}
        </h2>
        <div className={styles.textGroup} ref={textGroupRef}>
          <p className={styles.subtitle}>{HERO.subtitle}</p>
          <p className={styles.description}>{HERO.description}</p>
          <div className={styles.buttons}>
            {HERO.buttons.map((btn) => (
              <HomeButton href={btn.href} key={btn.label} variant="dark">
                {btn.label}
              </HomeButton>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
