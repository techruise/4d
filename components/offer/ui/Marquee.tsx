import { MARQUEE_ITEMS } from '@/lib/offer/content';

/** Infinite marquee strip. Duplicate copy is aria-hidden for screen readers. */
export default function Marquee() {
  const row = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item + (hidden ? 'b' : 'a')} className="flex items-center">
          <span className="whitespace-nowrap px-6 text-sm font-semibold uppercase tracking-[0.28em] text-muted">
            {item}
          </span>
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold" aria-hidden>
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee relative z-10 border-y border-line/60 bg-panel/40 py-4">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
