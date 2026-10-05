'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sceneState, smooth } from '@/lib/offer/scene';

/** Soft radial sprite used to fake volumetric glow, cheaply. */
function makeGlowTexture(inner: string, outer: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 126);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.35, outer);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type GlowPlane = { pos: [number, number, number]; size: number; base: number };

/** Volumetric-feel glows: a horizon the ship sails toward + accent pools. */
export default function Glow() {
  const { planes, mats, textures } = useMemo(() => {
    const cyanTex = makeGlowTexture('rgba(210, 250, 255, 0.9)', 'rgba(34, 211, 238, 0.35)');
    const goldTex = makeGlowTexture('rgba(255, 240, 210, 0.85)', 'rgba(245, 196, 81, 0.3)');
    const mk = (tex: THREE.Texture) =>
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });

    const cyanMat = mk(cyanTex);
    const cyanMat2 = mk(cyanTex);
    const goldMat = mk(goldTex);

    const defs: { mat: THREE.MeshBasicMaterial; def: GlowPlane }[] = [
      { mat: cyanMat, def: { pos: [0, 0.5, -26], size: 30, base: 0.5 } }, // horizon
      { mat: cyanMat2, def: { pos: [-5, 4.5, -14], size: 12, base: 0.12 } }, // top-left pool
      { mat: goldMat, def: { pos: [4.5, -1.6, -12], size: 8, base: 0.16 } }, // gold accent
    ];

    return {
      planes: defs,
      mats: [cyanMat, cyanMat2, goldMat],
      textures: [cyanTex, goldTex],
    };
  }, []);

  useEffect(() => {
    return () => {
      planes.forEach(({ mat }) => mat.dispose());
      mats.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      // (mats includes the plane materials already; double-dispose is a no-op)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock }) => {
    const p = sceneState.progress;
    const t = clock.elapsedTime;
    const finale = smooth(0.84, 1, p);
    planes.forEach(({ mat, def }, i) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 2.1);
      mat.opacity = (def.base + (i === 0 ? finale * 0.45 : finale * 0.1)) * (0.85 + 0.15 * pulse);
    });
  });

  return (
    <>
      {planes.map(({ mat, def }, i) => (
        <mesh key={i} position={def.pos} material={mat} renderOrder={0}>
          <planeGeometry args={[def.size, def.size]} />
        </mesh>
      ))}
    </>
  );
}
