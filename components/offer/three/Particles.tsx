'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mulberry32, sceneState, smooth } from '@/lib/offer/scene';

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uScale;
  attribute vec3 aPosB;
  attribute float aSeed;
  attribute float aSize;
  attribute float aTint;
  varying float vTint;
  varying float vAlpha;
  void main() {
    vec3 p = mix(position, aPosB, uMorph);
    p.x += sin(uTime * 0.35 + aSeed * 12.0) * 0.4;
    p.y += cos(uTime * 0.3 + aSeed * 20.0) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = max(-mv.z, 0.6);
    gl_PointSize = aSize * uScale * (30.0 / dist);
    vAlpha = smoothstep(24.0, 15.0, dist) * smoothstep(0.9, 2.6, dist);
    vTint = aTint;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying float vTint;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.08, d) * vAlpha * 0.85;
    vec3 cyan = vec3(0.13, 0.83, 0.93);
    vec3 gold = vec3(0.96, 0.77, 0.32);
    vec3 col = mix(cyan, gold, vTint);
    gl_FragColor = vec4(col, a);
  }
`;

/**
 * Instanced-style particle dust (one draw call, custom shader). Particles
 * start as ambient dust and morph into a tunnel the camera cruises through
 * on the way to the final CTA.
 */
export default function Particles({ count }: { count: number }) {
  const points = useMemo(() => {
    const rand = mulberry32(1337);
    const posA = new Float32Array(count * 3);
    const posB = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    const tint = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // A: ambient dust through the whole scene volume.
      posA[i * 3] = (rand() * 2 - 1) * 14;
      posA[i * 3 + 1] = (rand() * 2 - 1) * 8;
      posA[i * 3 + 2] = 8 - rand() * 30;
      // B: a ring tunnel around the camera path (formed near the finale).
      const ang = rand() * Math.PI * 2;
      const radius = 3.2 + rand() * 3.4;
      posB[i * 3] = Math.cos(ang) * radius;
      posB[i * 3 + 1] = Math.sin(ang) * radius * 0.75;
      posB[i * 3 + 2] = 6 - rand() * 28;
      seed[i] = rand();
      size[i] = 0.6 + rand() * 1.6;
      tint[i] = rand() < 0.12 ? 1 : 0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posA, 3));
    geo.setAttribute('aPosB', new THREE.BufferAttribute(posB, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aTint', new THREE.BufferAttribute(tint, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uScale: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    return pts;
  }, [count]);

  useEffect(() => {
    return () => {
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
    };
  }, [points]);

  useFrame(({ clock }) => {
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uMorph.value = smooth(0.62, 0.86, sceneState.progress);
  });

  return <primitive object={points} />;
}
