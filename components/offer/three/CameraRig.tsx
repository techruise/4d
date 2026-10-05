'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CAMERA_PATH, sceneState, samplePath } from '@/lib/offer/scene';

/**
 * Scroll-driven camera: position + look-at are sampled from a waypoint path
 * keyed to global scroll progress, then damped. Mouse parallax is layered on
 * top for the "4D" feel.
 */
export default function CameraRig() {
  const curPos = useRef(new THREE.Vector3(0, 0.1, 9.5));
  const curLook = useRef(new THREE.Vector3(0, 0.2, 0));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    const pos = samplePath(CAMERA_PATH, sceneState.progress, (w) => [...w.pos, ...w.look]);
    const tp = tmpPos.current.set(pos[0], pos[1], pos[2]);
    const tl = tmpLook.current.set(pos[3], pos[4], pos[5]);

    const parallax = sceneState.light ? 0.16 : 0.5;
    tp.x += sceneState.mouse.x * parallax;
    tp.y += -sceneState.mouse.y * parallax * 0.65;

    const d = 1 - Math.exp(-3.4 * Math.min(delta, 0.05));
    curPos.current.lerp(tp, d);
    curLook.current.lerp(tl, d);

    camera.position.copy(curPos.current);
    camera.lookAt(curLook.current);
  });

  return null;
}
