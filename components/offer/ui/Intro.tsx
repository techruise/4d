'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/offer/scene';
import Logo from './Logo';

/**
 * Page-load intro: logo mark + wordmark, progress line, then the curtain
 * lifts. Hidden entirely without JS (CSS-gated on html.js) and under
 * prefers-reduced-motion.
 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const [, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.display = 'none';
      setDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.intro-mark',
        { autoAlpha: 0, scale: 0.6, rotate: -10 },
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5 },
      )
        .fromTo(
          '.intro-letter',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.35 },
          '-=0.25',
        )
        .fromTo(
          '.intro-tag',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3 },
          '-=0.15',
        )
        .fromTo(
          '.intro-bar',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
          '-=0.4',
        )
        .to(el, { yPercent: -100, duration: 0.75, ease: 'expo.inOut', delay: 0.15 })
        .set(el, { display: 'none' });
    }, el);

    const safety = setTimeout(() => {
      el.style.display = 'none';
      setDone(true);
    }, 3200);

    return () => {
      ctx.revert();
      clearTimeout(safety);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="intro fixed inset-0 z-50 flex-col items-center justify-center bg-base"
    >
      <div className="intro-mark mb-6">
        <Logo className="h-16 w-16" />
      </div>
      <div className="flex items-baseline gap-[0.06em] text-3xl font-bold tracking-[0.35em] text-ink sm:text-4xl">
        {'TECHRUISE'.split('').map((c, i) => (
          <span key={i} className="intro-letter inline-block">
            {c}
          </span>
        ))}
      </div>
      <p className="intro-tag mt-3 text-xs uppercase tracking-[0.4em] text-muted">
        Let your business cruise
      </p>
      <div className="mt-8 h-px w-44 overflow-hidden rounded bg-line/70">
        <div className="intro-bar h-full w-full origin-left bg-gradient-to-r from-accent to-gold" />
      </div>
    </div>
  );
}
