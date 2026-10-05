'use client';

/**
 * Shared, mutable scene state. Written by the scroll bridge (GSAP) and read
 * every frame by the R3F scene — deliberately outside React to avoid
 * re-renders on scroll.
 */
export const sceneState = {
  /** Global page scroll progress, 0 → 1. */
  progress: 0,
  /** Normalized pointer position, -1 → 1. */
  mouse: { x: 0, y: 0 },
  /** Lightweight scene mode (mobile / low-power devices). */
  light: false,
  /** Set once the scene has mounted, so the intro ramp can play. */
  ready: false,
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoothstep between a and b evaluated at v. */
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a || 1e-6));
  return t * t * (3 - 2 * t);
};

/** Deterministic PRNG (mulberry32) so the scene is identical every load. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Vec3 = [number, number, number];

export type Waypoint = { p: number; pos: Vec3; look: Vec3 };

/** Piecewise-smooth interpolation along a list of keyed waypoints. */
export function samplePath<T extends { p: number }>(
  path: T[],
  p: number,
  extract: (w: T) => number[],
): number[] {
  const first = extract(path[0]);
  const last = extract(path[path.length - 1]);
  if (p <= path[0].p) return [...first];
  if (p >= path[path.length - 1].p) return [...last];
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p || 1e-6);
      const ts = t * t * (3 - 2 * t);
      const va = extract(a);
      const vb = extract(b);
      return va.map((v, j) => lerp(v, vb[j], ts));
    }
  }
  return [...last];
}

/** Camera flight path across the whole page journey. */
export const CAMERA_PATH: Waypoint[] = [
  { p: 0.0, pos: [0, 0.1, 9.5], look: [0, 0.2, 0] },
  { p: 0.12, pos: [-1.6, 0.5, 8.2], look: [0.2, 0.1, 0] },
  { p: 0.26, pos: [2.2, 1.0, 6.6], look: [-0.6, 0.2, -1.5] },
  { p: 0.42, pos: [0.4, 1.3, 5.0], look: [0, 0.6, -4] },
  { p: 0.56, pos: [-2.4, 0.9, 3.4], look: [0.4, 0.5, -4] },
  { p: 0.7, pos: [2.0, 0.6, 2.6], look: [-0.2, 0.3, -6] },
  { p: 0.84, pos: [-1.2, 0.4, 2.2], look: [0.3, 0.4, -8] },
  { p: 1.0, pos: [0, 0.8, 1.6], look: [0, 0.8, -24] },
];

export type ShipStation = { p: number; pos: Vec3; rotY: number; scale: number };

/** Where the ship sails as the page scrolls. */
export const SHIP_PATH: ShipStation[] = [
  { p: 0.0, pos: [2.4, 0.35, -0.6], rotY: -0.55, scale: 1 },
  { p: 0.14, pos: [-2.9, 0.6, -2.2], rotY: 0.55, scale: 0.92 },
  { p: 0.3, pos: [3.3, 1.15, -3.4], rotY: -0.9, scale: 0.85 },
  { p: 0.46, pos: [0.2, 0.75, -5.6], rotY: 0.35, scale: 0.9 },
  { p: 0.6, pos: [-3.6, 0.65, -6.5], rotY: 0.85, scale: 0.85 },
  { p: 0.74, pos: [2.8, 0.5, -8.5], rotY: -0.6, scale: 0.9 },
  { p: 0.88, pos: [-1.6, 0.6, -11], rotY: 0.3, scale: 1 },
  { p: 1.0, pos: [0, 0.9, -15], rotY: 0, scale: 1.1 },
];

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(pointer: coarse)').matches;
}
