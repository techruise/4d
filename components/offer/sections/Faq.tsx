'use client';

import { useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import Eyebrow from '../ui/Eyebrow';
import Reveal from '../ui/Reveal';
import { FAQS } from '@/lib/offer/content';

/**
 * Accessible FAQ accordion: buttons with aria-expanded + animated height.
 * Uses LazyMotion's lightweight `m` component to keep the payload small.
 */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" aria-label="Frequently asked questions" className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Eyebrow text={FAQS.eyebrow} />
          </div>
          <h2 className="text-[clamp(1.9rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-tight text-ink">
            {FAQS.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <LazyMotion features={domAnimation} strict>
          <div className="mt-12 space-y-3">
            {FAQS.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="glass overflow-hidden rounded-2xl">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:text-accent"
                    >
                      <span className="text-[15px] font-semibold text-ink sm:text-base">
                        {item.q}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden
                        className={`h-4 w-4 shrink-0 text-accent transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M12 5 V19 M5 12 H19" />
                      </svg>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        key="panel"
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
                        }
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-muted sm:text-base">
                          {item.a}
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          </LazyMotion>
        </Reveal>
      </div>
    </section>
  );
}
