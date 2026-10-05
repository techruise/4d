'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SHIP_PATH, lerp, samplePath, sceneState } from '@/lib/offer/scene';

function sailGeometry(verts: [number, number, number][]) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts.flat(), 3));
  geo.computeVertexNormals();
  return geo;
}

/** Low-poly sail-and-hull ship mark that sails through the scroll journey. */
export default function Ship({ light }: { light: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3());

  const hull = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.3, -0.4);
    shape.bezierCurveTo(0.1, -0.5, 0.9, -0.3, 1.5, 0);
    shape.bezierCurveTo(0.9, 0.3, 0.1, 0.5, -1.3, 0.4);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 1,
      steps: 1,
      curveSegments: 4,
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, -0.15, 0);
    return geo;
  }, []);

  const mainSail = useMemo(
    () =>
      sailGeometry([
        [0.06, 0.35, -0.07],
        [0.06, 1.76, -0.07],
        [-0.85, 0.35, -0.07],
      ]),
    [],
  );
  const jib = useMemo(
    () =>
      sailGeometry([
        [0.22, 0.4, 0.07],
        [0.2, 1.55, 0.07],
        [1.3, 0.4, 0.07],
      ]),
    [],
  );
  const flag = useMemo(
    () =>
      sailGeometry([
        [0.1, 1.86, 0],
        [0.1, 1.76, 0],
        [-0.34, 1.82, 0],
      ]),
    [],
  );

  // Dispose custom geometries on unmount.
  useMemo(() => () => {
    hull.dispose();
    mainSail.dispose();
    jib.dispose();
    flag.dispose();
  }, [hull, mainSail, jib, flag]);

  useFrame(({ clock }, delta) => {
    const g = outer.current;
    const b = inner.current;
    if (!g || !b) return;

    const s = samplePath(SHIP_PATH, sceneState.progress, (w) => [
      ...w.pos,
      w.rotY,
      w.scale,
    ]);
    const d = 1 - Math.exp(-2.6 * Math.min(delta, 0.05));
    target.current.set(s[0], s[1], s[2]);
    g.position.lerp(target.current, d);
    g.rotation.y = lerp(g.rotation.y, s[3], d);
    const sc = s[4] * (sceneState.light ? 0.62 : 1);
    const cs = lerp(g.scale.x, sc, d);
    g.scale.setScalar(cs);

    // Gentle bobbing + banking.
    const t = clock.elapsedTime;
    b.position.y = Math.sin(t * 0.85) * 0.09;
    b.rotation.z = Math.sin(t * 0.65) * 0.055;
    b.rotation.x = Math.cos(t * 0.55) * 0.03;
  });

  return (
    <group ref={outer} position={[2.4, 0.35, -0.6]}>
      <group ref={inner}>
        {/* Hull */}
        <mesh geometry={hull} castShadow={false}>
          <meshStandardMaterial
            color="#0E1830"
            metalness={0.55}
            roughness={0.35}
            emissive="#22D3EE"
            emissiveIntensity={0.09}
            flatShading
          />
        </mesh>
        {/* Gold gunwale trim */}
        <mesh position={[0.02, 0.19, 0]}>
          <boxGeometry args={[2.72, 0.045, 0.84]} />
          <meshStandardMaterial
            color="#F5C451"
            metalness={0.8}
            roughness={0.3}
            emissive="#F5C451"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Cabin */}
        <mesh position={[-0.45, 0.32, 0]}>
          <boxGeometry args={[0.55, 0.28, 0.34]} />
          <meshStandardMaterial
            color="#0D1526"
            metalness={0.4}
            roughness={0.4}
            emissive="#22D3EE"
            emissiveIntensity={0.14}
          />
        </mesh>
        {/* Mast */}
        <mesh position={[0.08, 1.1, 0]}>
          <cylinderGeometry args={[0.024, 0.036, 1.55, 6]} />
          <meshStandardMaterial color="#111B33" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Sails */}
        <mesh geometry={mainSail}>
          <meshStandardMaterial
            color="#EAF2FF"
            side={THREE.DoubleSide}
            roughness={0.65}
            emissive="#22D3EE"
            emissiveIntensity={0.14}
            flatShading
          />
        </mesh>
        <mesh geometry={jib}>
          <meshStandardMaterial
            color="#DCE9FB"
            side={THREE.DoubleSide}
            roughness={0.65}
            emissive="#22D3EE"
            emissiveIntensity={0.1}
            flatShading
          />
        </mesh>
        {/* Flag */}
        <mesh geometry={flag}>
          <meshStandardMaterial
            color="#F5C451"
            side={THREE.DoubleSide}
            emissive="#F5C451"
            emissiveIntensity={0.7}
          />
        </mesh>
      </group>
    </group>
  );
}
