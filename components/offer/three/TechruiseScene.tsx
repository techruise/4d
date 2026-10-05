'use client';

import { useEffect } from 'react';
import { Float } from '@react-three/drei';
import { sceneState } from '@/lib/offer/scene';
import CameraRig from './CameraRig';
import Ship from './Ship';
import Panels from './Panels';
import CircuitLines from './CircuitLines';
import Particles from './Particles';
import Glow from './Glow';

/**
 * The whole 3D journey: glass browser panels, a low-poly ship, particle
 * dust and circuit lines — one continuous scene the camera flies through
 * as the page scrolls.
 */
export default function TechruiseScene({ light }: { light: boolean }) {
  useEffect(() => {
    sceneState.ready = true;
  }, []);

  return (
    <>
      <fog attach="fog" args={['#060A13', 9, 36]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#22344F', '#05070D', 0.8]} />
      <directionalLight position={[5, 7, 6]} intensity={1.5} color="#CFEFFF" />
      <pointLight position={[-6, 3, 2]} intensity={55} distance={42} decay={2} color="#22D3EE" />
      <pointLight position={[4, -2, -6]} intensity={32} distance={36} decay={2} color="#F5C451" />

      <CameraRig />
      <Ship light={light} />
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.5} floatingRange={[-0.08, 0.12]}>
        <Panels light={light} />
      </Float>
      <CircuitLines light={light} />
      <Particles count={light ? 280 : 850} />
      <Glow />
    </>
  );
}
