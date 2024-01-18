"use client";

import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { AdditiveBlending, BackSide, Mesh } from "three";
import { useRef } from "react";

const EarthTexture = shaderMaterial(
  // uniforms
  {
    globeTexture: null,
  },
  // vertex shader
  /*glsl*/ `
  varying vec2 vUv;
  varying vec3 vertexNormal;
  void main() {
    vUv = uv; 
    vertexNormal = normalize(normalMatrix* normal);
    gl_Position =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `,
  // fragment shader
  /*glsl*/ `
  uniform sampler2D globeTexture;
  varying vec2 vUv;
  varying vec3 vertexNormal;
  void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0, 0, 1)); // calculates the intensity of the light
    vec3 atmosphereShade = vec3(0.3, 0.6, 1.0);
    vec3 atmosphere = atmosphereShade * pow(intensity, 1.5); // sets the color of the atmosphere

    gl_FragColor = vec4(
        atmosphere + texture2D(globeTexture, vUv).xyz,
        1.0
    );
  }
  `
);

extend({ EarthTexture });

const Earth = () => {
  const ref = useRef<Mesh>(null!);
  const earthTexture = useTexture("textures/earth_1200_600.jpeg");

  useFrame(() => {
    ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[5, 50, 50]} />
      {/* @ts-ignore */}
      <earthTexture globeTexture={earthTexture} />
    </mesh>
  );
};

const ExteriorAtmosphereMaterial = shaderMaterial(
  // uniforms
  {},
  // vertex shader
  /*glsl*/ `
  varying vec3 vertexNormal;
  void main() {
    vertexNormal = normalize(normalMatrix* normal);
    gl_Position =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `,
  // fragment shader
  /*glsl*/ `
  varying vec3 vertexNormal;
  void main() {
    float intensity = pow(0.5 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
  }
  `
);

extend({ ExteriorAtmosphereMaterial });

const EarthExteriorAtmosphere = () => {
  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[5, 50, 50]} />
      {/* @ts-ignore */}
      <exteriorAtmosphereMaterial blending={AdditiveBlending} side={BackSide} />
    </mesh>
  );
};

const Starfield = () => {
  const starVertices = [];
  for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000; // make sure stars are created behind our globe (push them in the negative z direction)
    starVertices.push(x, y, z);
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(starVertices), 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="white" transparent={true} size={0.4} />
    </points>
  );
};

export const EarthMoon3DScene = () => {
  return (
    <div id="canvas-container" className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 15] }}
        gl={{ pixelRatio: window.devicePixelRatio }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Earth />
        <EarthExteriorAtmosphere />
        <Starfield />
      </Canvas>
    </div>
  );
};
