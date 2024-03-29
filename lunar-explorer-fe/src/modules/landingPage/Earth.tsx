"use client";

import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { AdditiveBlending, BackSide, Mesh } from "three";

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
      float intensity = 1.1 - dot(vertexNormal, vec3(0, 0, 1)); // calculates the intensity of the light
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
      float intensity = pow(0.7 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
    `
);
extend({ ExteriorAtmosphereMaterial });

export const Earth = () => {
  const ref = useRef<Mesh>(null!);
  const earthTexture = useTexture("textures/earth_5400_2700.jpg");

  useFrame(() => {
    ref.current.rotation.y += 0.0005;
  });

  return (
    <mesh
      ref={ref}
      // position={[1.2, -1.5, 0]}
      rotation={[0.5, -3, 0]}
    >
      <sphereGeometry args={[5, 50, 50]} />
      {/* @ts-ignore */}
      <earthTexture globeTexture={earthTexture} />
    </mesh>
  );
};

export const EarthExteriorAtmosphere = () => {
  return (
    <mesh
      scale={[1.15, 1.15, 1.15]}
      // position={[1.2, -1.5, 0]}
    >
      <sphereGeometry args={[5, 50, 50]} />
      {/* @ts-ignore */}
      <exteriorAtmosphereMaterial blending={AdditiveBlending} side={BackSide} />
    </mesh>
  );
};
