'use client';

import { useEffect, useState } from 'react';
import Logo from '../ui/Logo';
import { BRAND } from '@/lib/offer/content';

const LINKS = [
  { label: 'What you get', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Process', href: '#process' },
  { label: 'AI', href: '#ai' },
  { label: 'Packages', href: '#packages' },
  { label: 'FAQ', href: '#faq' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'border-b border-line/70 bg-base/75 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-8xl items-center justify-between px-5 sm:px-8"
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${BRAND.name} — home`}>
          <Logo className="h-8 w-8" />
          <span className="text-sm font-bold tracking-[0.22em] text-ink">TECHRUISE</span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="link-underline text-[13px] font-medium text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-[13px] font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-base hover:shadow-glow-sm"
        >
          Get a quote
        </a>
      </nav>
    </header>
  );
}
