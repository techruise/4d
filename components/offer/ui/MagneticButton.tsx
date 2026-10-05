'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { isCoarsePointer, prefersReducedMotion } from '@/lib/offer/scene';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

/**
 * Magnetic CTA: the button is gently pulled toward the cursor while it is
 * nearby and springs back on leave. Disabled for touch and reduced motion.
 */
export default function MagneticButton({
  href,
  children,
  variant = 'primary',
  className = '',
  onClick,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isCoarsePointer() || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const range = Math.max(r.width, 150);
      if (Math.hypot(dx, dy) < range * 0.85) {
        xTo(dx * 0.32);
        yTo(dy * 0.32);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 will-change-transform';
  const styles =
    variant === 'primary'
      ? 'bg-accent text-base shadow-glow hover:bg-cyan-200 hover:shadow-glow-sm'
      : 'border border-line bg-panel/50 text-ink hover:border-accent/60 hover:text-accent';

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${styles} ${className}`}
    >
      {children}
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/25 blur-sm transition-all duration-700 ease-out group-hover:left-[130%]" />
        </span>
      )}
    </a>
  );
}
