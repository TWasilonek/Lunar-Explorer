"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Mesh } from "three";

export const Moon = () => {
  const moonTexture = useTexture("textures/2k_moon.jpg");
  const moonRef = useRef<Mesh>(null!);

  useFrame(() => {
    moonRef.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={moonRef} position={[-9, 0, -10]}>
      <sphereGeometry args={[2, 50, 50]} />
      <meshStandardMaterial map={moonTexture} />
    </mesh>
  );
};
