'use client';

import { useEffect, useState, type FormEvent } from 'react';
import MagneticButton from '../ui/MagneticButton';
import Reveal from '../ui/Reveal';
import { BRAND, FINAL_CTA } from '@/lib/offer/content';

type Status = 'idle' | 'sending' | 'success' | 'error';

const MAILTO = `mailto:${BRAND.email}?subject=${encodeURIComponent(
  'Free call with Techruise — website project',
)}`;

/** Final CTA: glowing panel with booking button, email and a working form. */
export default function FinalCta() {
  const [status, setStatus] = useState<Status>('idle');
  const [pkg, setPkg] = useState('Not sure yet');

  // "Get a quote" buttons elsewhere on the page pre-select the package.
  useEffect(() => {
    const handler = (e: Event) => setPkg((e as CustomEvent<string>).detail);
    window.addEventListener('techruise:package', handler);
    return () => window.removeEventListener('techruise:package', handler);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('company')) return; // honeypot — silently drop bots
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          package: fd.get('package'),
          message: fd.get('message'),
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full rounded-xl border border-line bg-base/70 px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-accent/60 focus:outline-none';

  return (
    <section
      id="contact"
      aria-label="Contact Techruise"
      className="relative px-5 pb-28 pt-16 sm:px-8 sm:pb-36"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grad-border relative overflow-hidden" style={{ padding: 1 }}>
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="glass-strong relative rounded-[calc(1.1rem-1px)] p-8 sm:p-14">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Left: pitch + direct contacts */}
                <div>
                  <h2 className="text-[clamp(2rem,5.4vw,3.8rem)] font-semibold leading-[1.08] tracking-tight text-ink">
                    {FINAL_CTA.title[0]}
                    <br />
                    {FINAL_CTA.title[1]}{' '}
                    <em className="font-serif italic font-normal text-accent glow-text">
                      {FINAL_CTA.accent}
                    </em>
                  </h2>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                    {FINAL_CTA.sub}
                  </p>
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <MagneticButton href={MAILTO}>{FINAL_CTA.bookCta}</MagneticButton>
                    <a
                      href={`mailto:${BRAND.email}`}
                      className="link-underline text-sm font-medium text-accent"
                    >
                      {BRAND.email}
                    </a>
                  </div>
                </div>

                {/* Right: form */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                    {FINAL_CTA.formTitle}
                  </h3>
                  {status === 'success' ? (
                    <div
                      role="status"
                      className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm text-accent"
                    >
                      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M4 12.5 L9.5 18 L20 6.5" />
                      </svg>
                      {FINAL_CTA.success}
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate={false}>
                      {/* Honeypot — hidden from humans */}
                      <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="pointer-events-none absolute h-0 w-0 opacity-0"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="cta-name" className="mb-1.5 block text-xs font-medium text-muted">
                            Name
                          </label>
                          <input id="cta-name" name="name" type="text" required placeholder="Your name" className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="cta-email" className="mb-1.5 block text-xs font-medium text-muted">
                            Email
                          </label>
                          <input id="cta-email" name="email" type="email" required placeholder="you@company.com" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="cta-package" className="mb-1.5 block text-xs font-medium text-muted">
                          Interested in
                        </label>
                        <select
                          id="cta-package"
                          name="package"
                          value={pkg}
                          onChange={(e) => setPkg(e.target.value)}
                          className={inputClass}
                        >
                          <option>Starter</option>
                          <option>Growth</option>
                          <option>Custom</option>
                          <option>Not sure yet</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="cta-message" className="mb-1.5 block text-xs font-medium text-muted">
                          Project brief
                        </label>
                        <textarea
                          id="cta-message"
                          name="message"
                          required
                          rows={4}
                          placeholder="What are you building? What should your website do?"
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-base shadow-glow transition-all duration-300 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-70"
                      >
                        {status === 'sending' ? 'Sending…' : 'Get my free quote'}
                      </button>
                      {status === 'error' && (
                        <p role="alert" className="text-xs leading-relaxed text-gold">
                          {FINAL_CTA.error}{' '}
                          <a href={`mailto:${BRAND.email}`} className="underline">
                            {BRAND.email}
                          </a>
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
