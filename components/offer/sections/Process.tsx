'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Eyebrow from '../ui/Eyebrow';
import Counter from '../ui/Counter';
import { PROCESS } from '@/lib/offer/content';
import { prefersReducedMotion } from '@/lib/offer/scene';

gsap.registerPlugin(ScrollTrigger);

/**
 * How it works: Discover → Design → Build → Launch, on a scroll-drawn
 * vertical path whose line inks itself in as you scroll, lighting each node.
 * The 3D scene behind reacts via the shared scroll progress.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Draw the rail.
      gsap.fromTo(
        '.process-rail-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-list',
            start: 'top 70%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        },
      );

      // Light each node + reveal its card as it arrives.
      el.querySelectorAll('.process-step').forEach((step) => {
        const dot = step.querySelector('.process-dot');
        const card = step.querySelector('.process-card');
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          onEnter: () => {
            dot?.classList.add('lit');
            gsap.fromTo(
              card,
              { autoAlpha: 0, x: 28 },
              { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' },
            );
          },
          onLeaveBack: () => dot?.classList.remove('lit'),
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="process"
      aria-label="How it works"
      className="relative px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-8xl">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow text={PROCESS.eyebrow} />
            <h2 className="max-w-xl text-[clamp(1.9rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-tight text-ink">
              {PROCESS.title}
            </h2>
          </div>
          <p className="pb-1 text-sm text-muted">
            <Counter
              to={PROCESS.steps.length}
              className="mr-2 font-serif text-6xl font-normal text-gold glow-text sm:text-7xl"
            />
            <span className="inline-block max-w-[10rem] align-middle leading-snug">
              {PROCESS.counterLabel}
            </span>
          </p>
        </div>

        <div className="process-list relative mx-auto mt-16 max-w-2xl lg:max-w-3xl">
          {/* Rail */}
          <div aria-hidden className="absolute bottom-6 left-[11px] top-2 w-px bg-line/70" />
          <div
            aria-hidden
            className="process-rail-fill absolute bottom-6 left-[11px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent to-gold shadow-glow-sm"
          />

          <ol className="space-y-14">
            {PROCESS.steps.map((s) => (
              <li key={s.num} className="process-step relative pl-14">
                <span
                  aria-hidden
                  className="process-dot absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-panel transition-all duration-500"
                >
                  <span className="block h-2 w-2 rounded-full bg-line transition-colors duration-500" />
                </span>
                <div className="process-card glass rounded-2xl p-6 transition-colors duration-500 sm:p-7">
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-3xl font-normal text-accent/90">{s.num}</span>
                    <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
