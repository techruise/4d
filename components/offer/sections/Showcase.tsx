'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Eyebrow from '../ui/Eyebrow';
import Reveal from '../ui/Reveal';
import { SHOWCASE } from '@/lib/offer/content';
import { prefersReducedMotion } from '@/lib/offer/scene';

gsap.registerPlugin(ScrollTrigger);

/** CSS-drawn website mockup — no images, crisp at every DPI. */
function Mockup({ variant }: { variant: string }) {
  const heroTint =
    variant === 'shop'
      ? 'from-gold/25 to-gold/5'
      : variant === 'bistro'
        ? 'from-gold/20 to-accent/5'
        : 'from-accent/25 to-accent/5';
  return (
    <div className="h-full w-full rounded-lg bg-base/70 p-3" aria-hidden>
      <div className="flex gap-1.5 pb-3">
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-gold/70" />
        <span className="ml-3 h-2 w-24 rounded-full bg-line/70" />
      </div>
      <div className={`h-[38%] rounded-md bg-gradient-to-br ${heroTint} p-2.5`}>
        <div className="h-2 w-1/2 rounded-full bg-ink/30" />
        <div className="mt-2 h-2 w-1/3 rounded-full bg-ink/20" />
        <div className="mt-3 h-4 w-16 rounded-full bg-accent/50" />
      </div>
      <div className="mt-2.5 grid h-[44%] grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md border border-line/70 bg-panel/80 p-2">
            <div className={`h-5 w-5 rounded ${i === 1 ? 'bg-gold/40' : 'bg-accent/40'}`} />
            <div className="mt-2 h-1.5 w-full rounded-full bg-line/80" />
            <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Showcase: pinned horizontal scroll on desktop, snap carousel on mobile. */
export default function Showcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    // Pinned horizontal scroll — large screens only.
    mm.add('(min-width: 1024px)', () => {
      const getDist = () => tr.scrollWidth - window.innerWidth;

      const tween = gsap.to(tr, {
        x: () => -getDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: () => `+=${getDist()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Subtle 3D rotation on cards based on distance from center.
            const cards = tr.querySelectorAll('.showcase-card');
            cards.forEach((card) => {
              const r = card.getBoundingClientRect();
              const c = (r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth;
              (card as HTMLElement).style.transform = `perspective(1200px) rotateY(${(-c * 7).toFixed(2)}deg)`;
            });
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress.toFixed(3)})`;
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(tr, { clearProps: 'all' });
        tr.querySelectorAll<HTMLElement>('.showcase-card').forEach((c) => {
          c.style.transform = '';
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={section}
      id="showcase"
      aria-label="Showcase"
      className="relative overflow-hidden py-28 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="px-5 sm:px-8">
        <div className="mx-auto max-w-8xl">
          <Reveal>
            <Eyebrow text={SHOWCASE.eyebrow} />
            <h2 className="max-w-2xl text-[clamp(1.9rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-tight text-ink">
              {SHOWCASE.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {SHOWCASE.sub}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-12 lg:mt-14">
        <div
          ref={track}
          className="no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:px-8 lg:snap-none lg:overflow-visible lg:px-[8vw]"
        >
          {SHOWCASE.projects.map((p, i) => (
            <article
              key={i}
              className="showcase-card glass flex w-[82vw] shrink-0 snap-center flex-col rounded-2xl p-5 will-change-transform sm:w-[26rem] lg:w-[30rem]"
            >
              <div className="rounded-xl border border-line/70">
                <div className="flex items-center gap-2 border-b border-line/70 bg-panel/90 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
                  <span className="ml-2 truncate rounded-md bg-base/80 px-2.5 py-1 text-[11px] text-muted">
                    [project].tech
                  </span>
                </div>
                <div className="h-56 sm:h-64">
                  <Mockup variant={p.variant} />
                </div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                  <p className="mt-0.5 text-sm text-muted">{p.kind}</p>
                </div>
                <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-accent/90">
                  0{i + 1}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-base/50 px-2.5 py-1 text-[11px] font-medium text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}

          {/* End CTA card */}
          <article className="showcase-card grad-border flex w-[82vw] shrink-0 snap-center flex-col items-start justify-center p-7 sm:w-[26rem] lg:w-[30rem]">
            <div className="glass-strong flex h-full w-full flex-col items-start justify-center rounded-[calc(1.1rem-1px)] p-8">
              <h3 className="text-2xl font-semibold text-ink">{SHOWCASE.endCard.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{SHOWCASE.endCard.body}</p>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base shadow-glow transition-transform duration-300 hover:scale-[1.03]"
              >
                {SHOWCASE.endCard.cta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
              </a>
            </div>
          </article>
        </div>

        {/* Horizontal progress bar (desktop pin) */}
        <div className="mx-auto mt-6 hidden h-px w-full max-w-8xl px-[8vw] lg:block">
          <div className="h-px w-full bg-line/70">
            <div
              ref={bar}
              className="h-px w-full origin-left bg-accent"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
        <p className="mt-2 px-5 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted lg:hidden">
          {SHOWCASE.swipeHint} →
        </p>
      </div>
    </section>
  );
}
