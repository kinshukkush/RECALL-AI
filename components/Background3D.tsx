'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const createSeededRandom = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const random = createSeededRandom(1337);
    for (let i = 0; i < count; i++) {
        // Randomly scatter points in a sphere
        const r = 20 * Math.cbrt(random());
        const theta = random() * 2 * Math.PI;
        const phi = Math.acos(2 * random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0" style={{ zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
