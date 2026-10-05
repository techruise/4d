'use client';

import { useEffect, useRef } from 'react';
import { isCoarsePointer, prefersReducedMotion } from '@/lib/offer/scene';

/** Soft cyan glow that trails the cursor. Hidden on touch / reduced motion. */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isCoarsePointer() || prefersReducedMotion()) return;

    let raf = 0;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.1;
      pos.y += (target.y - pos.y) * 0.1;
      el.style.transform = `translate3d(${(pos.x - 260).toFixed(1)}px, ${(pos.y - 260).toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[520px] w-[520px] rounded-full opacity-0 transition-opacity duration-700"
      style={{
        background:
          'radial-gradient(circle, rgba(34,211,238,0.10), rgba(34,211,238,0.03) 38%, transparent 66%)',
      }}
    />
  );
}
