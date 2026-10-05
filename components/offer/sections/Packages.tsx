'use client';

import Eyebrow from '../ui/Eyebrow';
import Reveal from '../ui/Reveal';
import TiltCard from '../ui/TiltCard';
import { PACKAGES } from '@/lib/offer/content';

/** Packages: Starter / Growth / Custom — no prices, quote-driven. */
export default function Packages() {
  const quote = (tier: string) => () => {
    window.dispatchEvent(new CustomEvent('techruise:package', { detail: tier }));
  };

  return (
    <section id="packages" aria-label="Packages" className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-8xl">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Eyebrow text={PACKAGES.eyebrow} />
          </div>
          <h2 className="mx-auto max-w-2xl text-[clamp(1.9rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-tight text-ink">
            {PACKAGES.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {PACKAGES.sub}
          </p>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {PACKAGES.tiers.map((tier, i) => {
            const inner = (
              <div
                className={`flex h-full flex-col rounded-[calc(1.1rem-1px)] p-8 ${
                  tier.featured ? 'glass-strong shadow-glow' : 'glass'
                }`}
              >
                {'badge' in tier && tier.badge && (
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                      <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
                    </svg>
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-2xl font-semibold text-ink">{tier.name}</h3>
                <p className="mt-1.5 text-sm text-muted">{tier.blurb}</p>
                <ul className="mt-7 flex-1 space-y-3.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink/90">
                      <svg
                        viewBox="0 0 24 24"
                        className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? 'text-gold' : 'text-accent'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M4 12.5 L9.5 18 L20 6.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={quote(tier.name)}
                  className={`mt-9 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    tier.featured
                      ? 'bg-accent text-base shadow-glow hover:scale-[1.02]'
                      : 'border border-line bg-panel/60 text-ink hover:border-accent/60 hover:text-accent'
                  }`}
                >
                  {PACKAGES.cta}
                </a>
              </div>
            );

            return (
              <Reveal key={tier.name} delay={i * 0.08} className="h-full">
                {tier.featured ? (
                  <div className="grad-border h-full" style={{ padding: 1 }}>
                    {inner}
                  </div>
                ) : (
                  <TiltCard className="h-full rounded-2xl" max={6}>
                    {inner}
                  </TiltCard>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
