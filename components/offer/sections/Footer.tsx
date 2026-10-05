import Logo from '../ui/Logo';
import { BRAND } from '@/lib/offer/content';

const EXPLORE = [
  { label: 'What you get', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Process', href: '#process' },
  { label: 'AI add-ons', href: '#ai' },
];

const OFFER = [
  { label: 'Packages', href: '#packages' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Get a quote', href: '#contact' },
  { label: 'Book a free call', href: '#contact' },
];

/** Footer. */
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line/70 bg-base/80 px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto max-w-8xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="text-sm font-bold tracking-[0.22em] text-ink">TECHRUISE</span>
            </a>
            <p className="mt-4 max-w-xs font-serif text-lg italic text-muted">
              {BRAND.tagline}.
            </p>
            <a
              href={`mailto:${BRAND.email}`}
              className="link-underline mt-5 inline-block text-sm text-accent"
            >
              {BRAND.email}
            </a>
          </div>

          <nav aria-label="Footer — explore">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="link-underline text-sm text-ink/80 hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — offer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">The offer</h2>
            <ul className="mt-4 space-y-2.5">
              {OFFER.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="link-underline text-sm text-ink/80 hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line/60 pt-7 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="font-serif italic text-sm text-muted/90">{BRAND.tagline}.</p>
          <p className="text-muted/70">This website was built by {BRAND.name} — obviously.</p>
        </div>
      </div>
    </footer>
  );
}
