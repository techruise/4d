'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { prefersReducedMotion, sceneState } from '@/lib/offer/scene';

/** The actual three.js canvas — code-split so three never touches SSR. */
const R3FCanvas = dynamic(() => import('./three/R3FCanvas'), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

/**
 * Detects software rasterizers (SwiftShader, llvmpipe…). Rendering the scene
 * on them costs seconds of main-thread time per frame, so we show the static
 * gradient fallback instead — identical to what real low-power fallback wants.
 */
function isSoftwareGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));
    const slow = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return slow;
  } catch {
    return true;
  }
}

type Mode = 'idle' | 'on' | 'fading' | 'off';

/**
 * Fixed, full-viewport 3D backdrop.
 * - Lazy: mounts only after the window `load` event (never blocks LCP/TTI).
 * - Falls back to the static CSS gradient when WebGL is missing, when the GL
 *   implementation is software-only, or when rendering stays under ~20fps.
 * - Under prefers-reduced-motion: no canvas at all, static layout.
 * - Mobile / low-power: lighter scene (fewer particles, capped DPR, dimmed).
 */
export default function Scene3D() {
  const [mode, setMode] = useState<Mode>('idle');
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !hasWebGL() || isSoftwareGL()) {
      setMode('off');
      return;
    }

    const coarse = window.matchMedia('(pointer: coarse)');
    const narrow = window.matchMedia('(max-width: 768px)');
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const isLight = coarse.matches || narrow.matches || lowPower;
    sceneState.light = isLight;
    setLight(isLight);

    // Wait for `load`, then a beat — the canvas must never compete with
    // hydration / LCP for the main thread.
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => setMode((m) => (m === 'idle' ? 'on' : m)), 150);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    const onChange = () => {
      sceneState.light = coarse.matches || narrow.matches || lowPower;
    };
    coarse.addEventListener?.('change', onChange);
    narrow.addEventListener?.('change', onChange);

    return () => {
      coarse.removeEventListener?.('change', onChange);
      narrow.removeEventListener?.('change', onChange);
      window.removeEventListener('load', start);
      window.clearTimeout(timer);
    };
  }, []);

  // FPS watchdog fallback: fade the canvas out, leaving the static gradient.
  const handleSlow = () => {
    setMode((m) => (m === 'on' ? 'fading' : m));
  };
  useEffect(() => {
    if (mode !== 'fading') return;
    const t = window.setTimeout(() => setMode('off'), 750);
    return () => window.clearTimeout(t);
  }, [mode]);

  if (mode === 'off' || mode === 'idle') return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
      style={{ opacity: mode === 'fading' ? 0 : light ? 0.6 : 1 }}
    >
      <R3FCanvas light={light} onTooSlow={handleSlow} />
    </div>
  );
}
