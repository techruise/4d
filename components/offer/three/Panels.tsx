'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { lerp, mulberry32, sceneState, smooth, type Vec3 } from '@/lib/offer/scene';

type PanelDef = {
  s: Vec3; // scattered position
  sr: Vec3; // scattered rotation
  g: Vec3; // assembled (website) position
  w: number;
  h: number;
};

const PANELS: PanelDef[] = [
  { s: [-4.5, 2.6, -1.5], sr: [0.1, 0.5, -0.12], g: [0, 2.5, -4.6], w: 7.2, h: 0.5 },
  { s: [3.5, -1.2, -3], sr: [-0.08, -0.4, 0.1], g: [0, 1.45, -4.6], w: 7.2, h: 1.8 },
  { s: [-2.2, -1.8, -4], sr: [0.15, 0.35, 0.18], g: [-2.45, -0.1, -4.6], w: 2.25, h: 1.35 },
  { s: [0.5, 2.2, -5.5], sr: [-0.12, 0.15, -0.2], g: [0, -0.1, -4.6], w: 2.25, h: 1.35 },
  { s: [4.2, 0.4, -6], sr: [0.1, -0.3, 0.12], g: [2.45, -0.1, -4.6], w: 2.25, h: 1.35 },
  { s: [-4.8, -0.6, -6.5], sr: [-0.1, 0.55, 0.08], g: [0, -1.5, -4.6], w: 5.4, h: 0.75 },
  { s: [5.2, 2.4, -4], sr: [0.06, -0.5, 0.14], g: [4.9, 2.1, -3.6], w: 1.9, h: 1.25 },
  { s: [-5.6, 0.8, -3], sr: [-0.05, 0.6, -0.1], g: [-5.1, -1.7, -4.2], w: 1.9, h: 1.25 },
];

/** Draws a glassy browser-window sprite once; reused as a texture. */
function makePanelTexture() {
  const w = 512;
  const h = 320;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const r = 18;
  ctx.beginPath();
  ctx.roundRect(4, 4, w - 8, h - 8, r);
  ctx.fillStyle = 'rgba(13, 21, 38, 0.94)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.75)';
  ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Header bar + traffic dots.
  ctx.strokeStyle = 'rgba(30, 43, 71, 0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(4, 40);
  ctx.lineTo(w - 4, 40);
  ctx.stroke();
  const dots = ['#1E2B47', '#1E2B47', '#F5C451'];
  dots.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(28 + i * 22, 22, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });

  // Hero block.
  const grad = ctx.createLinearGradient(28, 60, 300, 160);
  grad.addColorStop(0, 'rgba(34, 211, 238, 0.32)');
  grad.addColorStop(1, 'rgba(34, 211, 238, 0.06)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(28, 58, 290, 92, 10);
  ctx.fill();

  // Skeleton text lines.
  ctx.fillStyle = 'rgba(142, 155, 179, 0.55)';
  [62, 80, 98].forEach((y, i) => {
    ctx.beginPath();
    ctx.roundRect(28, 166 + y - 62, 120 + i * 46, 9, 4);
    ctx.fill();
  });

  // CTA pill.
  ctx.fillStyle = 'rgba(245, 196, 81, 0.9)';
  ctx.beginPath();
  ctx.roundRect(28, 246, 92, 26, 13);
  ctx.fill();

  // Side blocks.
  ctx.fillStyle = 'rgba(30, 43, 71, 0.7)';
  ctx.beginPath();
  ctx.roundRect(340, 58, 144, 214, 10);
  ctx.fill();
  ctx.fillStyle = 'rgba(34, 211, 238, 0.35)';
  ctx.beginPath();
  ctx.roundRect(354, 74, 116, 10, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(354, 96, 90, 10, 5);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  return tex;
}

/**
 * Floating glass browser panels. They drift scattered through the hero and
 * assemble into a full website layout as the scroll journey progresses.
 */
export default function Panels({ light }: { light: boolean }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const { viewport } = useThree();

  const texture = useMemo(() => makePanelTexture(), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture ?? undefined,
        transparent: true,
        depthWrite: false,
        opacity: 0.95,
      }),
    [texture],
  );

  const phases = useMemo(() => {
    const rand = mulberry32(42);
    return PANELS.map(() => ({
      bobX: 0.5 + rand() * 1.4,
      bobY: 0.5 + rand() * 1.8,
      bobZ: 0.5 + rand() * 1.1,
      ampX: 0.1 + rand() * 0.22,
      ampY: 0.12 + rand() * 0.24,
      rotW: 0.3 + rand() * 0.8,
    }));
  }, []);

  useEffect(() => {
    return () => {
      material.dispose();
      texture?.dispose();
    };
  }, [material, texture]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;

    const t = clock.elapsedTime;
    const p = sceneState.progress;
    const intro = smooth(0, 0.06, t * 0.35 + p * 0.4) * smooth(0, 0.5, t * 0.8);
    const u = smooth(0.2, 0.42, p) * intro;
    material.opacity = lerp(0.55, 0.95, intro) * (light ? 0.8 : 1);

    // Keep the assembled layout inside view on narrow screens.
    const aspect = viewport.width / Math.max(viewport.height, 0.001);
    const sx = THREE.MathUtils.clamp(aspect / 1.6, 0.6, 1.05) * (light ? 0.86 : 1);
    g.scale.x = lerp(g.scale.x, sx, 0.08);

    PANELS.forEach((def, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const ph = phases[i];
      const bx = Math.sin(t * 0.45 * ph.bobX + i) * ph.ampX;
      const by = Math.cos(t * 0.4 * ph.bobY + i * 1.7) * ph.ampY;
      const brz = Math.sin(t * 0.3 * ph.rotW + i) * 0.06;

      m.position.set(
        lerp(def.s[0] + bx, def.g[0], u),
        lerp(def.s[1] + by, def.g[1], u),
        lerp(def.s[2], def.g[2], u),
      );
      m.rotation.set(
        lerp(def.sr[0] + by * 0.4, 0.015, u),
        lerp(def.sr[1] + bx * 0.5, -0.02, u),
        lerp(def.sr[2] + brz, 0, u),
      );
    });
  });

  return (
    <group ref={group}>
      {PANELS.map((def, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          position={def.s}
          rotation={def.sr}
          material={material}
          renderOrder={1}
        >
          <planeGeometry args={[def.w, def.h, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
