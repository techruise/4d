'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from '../ui/MagneticButton';
import { HERO } from '@/lib/offer/content';
import { prefersReducedMotion } from '@/lib/offer/scene';

/** Hero: badge pill, line-by-line split-text headline, CTAs — over the 3D scene. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set('.hero-line-inner', { yPercent: 120, rotate: 3 });
      gsap.set('.hero-fade', { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.9 });
      tl.to('.hero-line-inner', { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.13 })
        .to('.hero-fade', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, '-=0.7');
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Hero"
      className="relative flex min-h-[100svh] items-center px-5 pb-28 pt-28 sm:px-8"
    >
      <div className="mx-auto w-full max-w-8xl">
        <div className="max-w-3xl">
          <p className="hero-fade mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {HERO.badge}
          </p>

          <h1 className="text-[clamp(2.7rem,9.2vw,7.2rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
            {[HERO.lines[0], HERO.lines[1]].map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <span className="hero-line-inner block will-change-transform">{line}</span>
              </span>
            ))}
            <span className="block overflow-hidden pb-2">
              <span className="hero-line-inner block will-change-transform">
                <em className="font-serif text-[1.08em] font-normal not-italic italic text-accent glow-text">
                  {HERO.accent}
                </em>
                {HERO.trail}
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {HERO.sub}
          </p>

          <div className="hero-fade mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton href="#contact">{HERO.primaryCta}</MagneticButton>
            <MagneticButton href="#showcase" variant="ghost">
              {HERO.secondaryCta}
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="hero-fade pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-muted">
          {HERO.scrollHint}
        </span>
        <span className="h-10 w-px overflow-hidden bg-line">
          <span className="scroll-line block h-full w-full bg-accent" />
        </span>
      </div>
    </section>
  );
}
