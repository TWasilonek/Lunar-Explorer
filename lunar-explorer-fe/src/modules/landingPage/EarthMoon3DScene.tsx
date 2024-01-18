"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect } from "react";
import { GUI } from "dat.gui";
import { Earth, EarthExteriorAtmosphere } from "./Earth";
import { Starfield } from "./Starfield";
import { Moon } from "./Moon";

const startCameraPosition = new Vector3(0, 0, 6);
const cameraPosition2 = new Vector3(0, 0, 10);
const cameraMoonPosition = new Vector3(-9.2, -0.5, -5.5);

const CameraControl = () => {
  const { camera } = useThree();

  useEffect(() => {
    const gui = new GUI();
    gui.domElement.style.marginTop = "100px";
    console.log(camera);
    gui.add(camera.rotation, "x", -Math.PI * 2, Math.PI * 2);
    gui.add(camera.rotation, "y", -Math.PI * 2, Math.PI * 2);
    gui.add(camera.rotation, "z", -Math.PI * 2, Math.PI * 2);
    gui.add(camera.position, "x", -10, 10);
    gui.add(camera.position, "y", -10, 10);
    gui.add(camera.position, "z", -10, 10);
    return () => {
      gui.destroy();
    };
  }, []);

  return null;
};

export const EarthMoon3DScene = () => {
  return (
    <div id="canvas-container" className="w-full h-screen mt-8">
      <Canvas camera={{ position: cameraMoonPosition, rotation: [0, 0, 0] }}>
        {/* <CameraControl /> */}
        <directionalLight args={[0xffffff, 3]} position={[0, 0, 2]} />
        <Moon />
        <Earth />
        <EarthExteriorAtmosphere />
        <Starfield />
      </Canvas>
    </div>
  );
};
