'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Eyebrow from '../ui/Eyebrow';
import { PROBLEM } from '@/lib/offer/content';
import { prefersReducedMotion } from '@/lib/offer/scene';

gsap.registerPlugin(ScrollTrigger);

/** Problem statement: punchy, word-by-word scrubbed reveal. */
export default function Problem() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.problem-word',
        { opacity: 0.12, y: 6 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 72%',
            end: 'top 26%',
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const words = `${PROBLEM.lead}`.split(' ');

  return (
    <section ref={root} aria-label="The problem" className="relative px-5 py-28 sm:px-8 sm:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Eyebrow text={PROBLEM.eyebrow} />
        </div>
        <h2 className="text-[clamp(1.9rem,5.4vw,3.9rem)] font-semibold leading-[1.14] tracking-tight text-ink">
          <span aria-label={PROBLEM.lead}>
            {words.map((w, i) => (
              <span key={i} aria-hidden className="problem-word inline-block will-change-transform">
                {w}
                {'\u00A0'}
              </span>
            ))}
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {PROBLEM.body}
        </p>
      </div>
    </section>
  );
}
