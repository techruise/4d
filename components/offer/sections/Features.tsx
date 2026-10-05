'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Eyebrow from '../ui/Eyebrow';
import Reveal from '../ui/Reveal';
import TiltCard from '../ui/TiltCard';
import { FEATURES } from '@/lib/offer/content';
import { prefersReducedMotion } from '@/lib/offer/scene';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ReactNode> = {
  design: (
    <>
      <path d="M12 3 L21 8 L12 13 L3 8 Z" />
      <path d="M3 12.5 L12 17.5 L21 12.5" />
      <path d="M3 17 L12 22 L21 17" />
    </>
  ),
  motion: (
    <>
      <path d="M12 2 L14.4 8.6 L21 9.2 L16 13.6 L17.5 20.4 L12 16.8 L6.5 20.4 L8 13.6 L3 9.2 L9.6 8.6 Z" />
    </>
  ),
  ai: (
    <>
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 3 V7 M8 12 H8.01 M16 12 H16.01 M9 16 H15" />
    </>
  ),
  speed: (
    <>
      <path d="M4 16 A 9 9 0 1 1 20 16" />
      <path d="M12 14 L16 8" />
      <path d="M2 20 H22" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18.5 H13" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20 L5 15 L16.5 3.5 A 2.1 2.1 0 0 1 19.5 6.5 L8 18 Z" />
      <path d="M14.5 5.5 L17.5 8.5" />
    </>
  ),
};

/** "What you get": six 3D tilt cards with cursor-following glare. */
export default function Features() {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-card',
        { autoAlpha: 0, y: 44 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" aria-label="What you get" className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-8xl">
        <Reveal>
          <Eyebrow text={FEATURES.eyebrow} />
          <h2 className="max-w-2xl text-[clamp(1.9rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-tight text-ink">
            {FEATURES.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {FEATURES.sub}
          </p>
        </Reveal>

        <div ref={grid} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.items.map((f) => (
            <div key={f.title} className="feature-card">
              <TiltCard className="glass h-full rounded-2xl p-7 transition-colors duration-300 hover:border-accent/40">
                <div className="mb-5 inline-flex rounded-xl border border-line bg-base/60 p-3 text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {ICONS[f.icon]}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{f.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-base/50 px-2.5 py-1 text-[11px] font-medium text-accent/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
