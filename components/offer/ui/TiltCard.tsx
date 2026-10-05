'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { isCoarsePointer, prefersReducedMotion } from '@/lib/offer/scene';

/**
 * 3D tilt card: perspective rotation that follows the pointer, with a
 * glare/glow tracking the cursor. Runs on rAF with lerp for smoothness and
 * skips itself on touch devices / reduced motion.
 */
export default function TiltCard({
  children,
  className = '',
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    if (isCoarsePointer() || prefersReducedMotion()) return;

    let raf = 0;
    let active = false;
    const cur = { rx: 0, ry: 0, s: 1 };
    const target = { rx: 0, ry: 0, s: 1 };

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const inside = px >= 0 && px <= 1 && py >= 0 && py <= 1;
      target.ry = inside ? (px - 0.5) * 2 * max : 0;
      target.rx = inside ? -(py - 0.5) * 2 * max : 0;
      target.s = inside ? 1.015 : 1;
      if (inside) {
        card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      }
    };

    const loop = () => {
      if (active) {
        cur.rx += (target.rx - cur.rx) * 0.14;
        cur.ry += (target.ry - cur.ry) * 0.14;
        cur.s += (target.s - cur.s) * 0.14;
        card.style.transform = `perspective(900px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg) scale(${cur.s.toFixed(3)})`;
        glare.style.opacity = target.s > 1.001 ? '1' : '0';
      }
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    });
    io.observe(card);
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={cardRef} className={`tilt-card relative will-change-transform ${className}`}>
      <div ref={glareRef} aria-hidden className="glare absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300" />
      <div className="relative h-full" style={{ transform: 'translateZ(26px)' }}>
        {children}
      </div>
    </div>
  );
}
