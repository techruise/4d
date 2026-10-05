'use client';

import Reveal from '../ui/Reveal';
import { FOUNDER } from '@/lib/offer/content';

/** Founder strip: short note from Raja Hunain (draft copy, edit in content.ts). */
export default function Founder() {
  return (
    <section aria-label="A note from the founder" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <figure className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-gold/10 blur-3xl"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              {FOUNDER.eyebrow}
            </p>
            <blockquote className="mt-6">
              <p className="font-serif text-[clamp(1.25rem,2.6vw,1.7rem)] font-normal italic leading-relaxed text-ink/95">
                “{FOUNDER.quote}”
              </p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span
                aria-hidden
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-base text-sm font-bold tracking-widest text-gold"
              >
                RH
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{FOUNDER.name}</span>
                <span className="block text-xs text-muted">{FOUNDER.role}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
