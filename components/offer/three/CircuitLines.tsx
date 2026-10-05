'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sceneState, smooth, type Vec3 } from '@/lib/offer/scene';

const NODES: Vec3[] = [
  [0, 2.5, -4.6],
  [0, 1.45, -4.6],
  [-2.45, -0.1, -4.6],
  [0, -0.1, -4.6],
  [2.45, -0.1, -4.6],
  [0, -1.5, -4.6],
  [4.9, 2.1, -3.6],
  [-5.1, -1.7, -4.2],
  [-3.6, 0.7, -4.6],
  [3.6, 0.7, -4.6],
  [0, 3.6, -4.4],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [3, 5],
  [4, 5],
  [3, 8],
  [3, 9],
  [6, 0],
  [7, 2],
  [0, 10],
  [8, 2],
  [9, 4],
];

/** Circuit lines that connect the assembled website like a motherboard. */
export default function CircuitLines({ light }: { light: boolean }) {
  const { lines, nodes, lineMat, nodeMat } = useMemo(() => {
    const positions = new Float32Array(EDGES.length * 6);
    EDGES.forEach(([a, b], i) => {
      positions.set(NODES[a], i * 6);
      positions.set(NODES[b], i * 6 + 3);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(NODES.flat()), 3),
    );

    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = dotCanvas.height = 64;
    const dctx = dotCanvas.getContext('2d');
    if (dctx) {
      const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(255,255,255,0.7)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      dctx.fillStyle = grad;
      dctx.fillRect(0, 0, 64, 64);
    }
    const dotTex = new THREE.CanvasTexture(dotCanvas);

    const lMat = new THREE.LineBasicMaterial({
      color: '#22D3EE',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });
    const nMat = new THREE.PointsMaterial({
      color: '#F5C451',
      size: 0.16,
      map: dotTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      fog: false,
    });

    const l = new THREE.LineSegments(lineGeo, lMat);
    l.frustumCulled = false;
    l.renderOrder = 2;
    const n = new THREE.Points(nodeGeo, nMat);
    n.frustumCulled = false;
    n.renderOrder = 2;

    return { lines: l, nodes: n, lineMat: lMat, nodeMat: nMat };
  }, []);

  useEffect(() => {
    return () => {
      lines.geometry.dispose();
      nodes.geometry.dispose();
      lineMat.map?.dispose();
      lineMat.dispose();
      nodeMat.dispose();
    };
  }, [lines, nodes, lineMat, nodeMat]);

  useFrame(({ clock }) => {
    const p = sceneState.progress;
    const t = clock.elapsedTime;
    const u = smooth(0.3, 0.46, p) * (1 - smooth(0.84, 0.96, p));
    // Skip rendering (and thus first-frame shader compilation) until used.
    lines.visible = nodes.visible = u > 0.005;
    lineMat.opacity = u * (0.26 + 0.1 * Math.sin(t * 2.2)) * (light ? 0.7 : 1);
    nodeMat.opacity = u * (0.5 + 0.2 * Math.sin(t * 2.2 + 1.2));
  });

  return (
    <>
      <primitive object={lines} />
      <primitive object={nodes} />
    </>
  );
}
