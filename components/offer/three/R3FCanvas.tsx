'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import TechruiseScene from './TechruiseScene';

/**
 * Watches the first ~2s of rendering. If the device can't hold ~20fps
 * (weak GPU / software rendering), it calls `onTooSlow` once so the host can
 * gracefully fall back to the static gradient.
 */
function PerfGuard({ onTooSlow }: { onTooSlow: () => void }) {
  const acc = useRef({ t: 0, frames: 0, judged: false });

  useFrame((_, delta) => {
    const a = acc.current;
    if (a.judged) return;
    a.t += delta;
    a.frames += 1;
    if (a.t >= 2) {
      a.judged = true;
      if (a.frames / a.t < 20) onTooSlow();
    }
  });

  return null;
}

/**
 * The R3F canvas. DPR is capped at 2 (1.5 on light mode), antialias is
 * disabled on lightweight devices, and rendering is driven by rAF (which
 * the browser pauses automatically when the tab is hidden).
 */
export default function R3FCanvas({
  light,
  onTooSlow,
}: {
  light: boolean;
  onTooSlow: () => void;
}) {
  return (
    <Canvas
      dpr={[1, light ? 1.5 : 2]}
      camera={{ fov: 42, near: 0.1, far: 90, position: [0, 0.1, 9.5] }}
      gl={{
        antialias: !light,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <TechruiseScene light={light} />
      <PerfGuard onTooSlow={onTooSlow} />
    </Canvas>
  );
}
