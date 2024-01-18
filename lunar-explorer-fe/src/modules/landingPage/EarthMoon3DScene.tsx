"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect } from "react";
import gsap from "gsap";
import { GUI } from "dat.gui";
import { Earth, EarthExteriorAtmosphere } from "./Earth";
import { Starfield } from "./Starfield";
import { Moon } from "./Moon";
import { SCENE } from "./Hero";

const startCameraPosition = new Vector3(-3, 2, 5.3);
const cameraPosition2 = new Vector3(-2, 0, 7);
const cameraMoonPosition = new Vector3(-9, 0.8, -4);

type CameraControlProps = {
  animateCamera?: gsap.TweenVars | gsap.TweenVars[];
  scene: SCENE;
};
const CameraControl = ({ scene }: CameraControlProps) => {
  const { camera } = useThree();

  useEffect(() => {
    let ctx: gsap.Context;

    if (scene === SCENE.TWO) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.to(camera.position, {
          x: startCameraPosition.x,
          y: startCameraPosition.y,
          z: startCameraPosition.z,
          duration: 0,
          repeatRefresh: true,
        })
          .to(camera.position, {
            x: cameraPosition2.x,
            y: cameraPosition2.y,
            z: cameraPosition2.z,
            ease: "power1.inOut",
            duration: 2,
            repeatRefresh: true,
          })
          .to(camera.position, {
            x: cameraMoonPosition.x,
            y: cameraMoonPosition.y,
            z: cameraMoonPosition.z,
            ease: "sine.inOut",
            duration: 5,
            repeatRefresh: true,
          });
      }, camera); // <- scopes all selector text inside the context to this component (optional, default is document)
    } else {
      ctx = gsap.context(() => {
        gsap.to(camera.position, {
          x: startCameraPosition.x,
          y: startCameraPosition.y,
          z: startCameraPosition.z,
          ease: "power1.out",
          duration: 5,
          repeatRefresh: true,
        });
      }, camera); // <- scopes all selector text inside the context to this component (optional, default is document)
    }

    return () => ctx.revert(); // cleanup!
  }, [camera, scene]);

  // useEffect(() => {
  //   const gui = new GUI();
  //   gui.domElement.style.marginTop = "100px";
  //   console.log(camera);
  //   gui.add(camera.rotation, "x", -Math.PI * 2, Math.PI * 2);
  //   gui.add(camera.rotation, "y", -Math.PI * 2, Math.PI * 2);
  //   gui.add(camera.rotation, "z", -Math.PI * 2, Math.PI * 2);
  //   gui.add(camera.position, "x", -10, 10);
  //   gui.add(camera.position, "y", -10, 10);
  //   gui.add(camera.position, "z", -10, 10);
  //   return () => {
  //     gui.destroy();
  //   };
  // }, []);

  // useFrame(({ camera }) => {
  //   // camera.position.x = camera.position.x + 0.01;
  //   // camera.position.y = camera.position.y + 0.01;
  //   // camera.position.z = camera.position.z + 0.01;
  //   camera.lookAt(0, 0, 0);
  // });

  return null;
};

type Props = {
  className?: string;
  scene: SCENE;
};

export const EarthMoon3DScene = ({ className, scene }: Props) => {
  return (
    <div id="canvas-container" className={`h-screen mt-8 ${className}`}>
      <Canvas camera={{ position: [0, 0, 10], rotation: [0, 0, 0] }}>
        <CameraControl scene={scene} />
        <directionalLight args={[0xffffff, 3]} position={[0, 0, 2]} />
        <Moon />
        <Earth />
        <EarthExteriorAtmosphere />
        <Starfield />
      </Canvas>
    </div>
  );
};
