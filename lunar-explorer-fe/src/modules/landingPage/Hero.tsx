"use client";

import { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { Scene1Content } from "./Scene1Content";
import { EarthMoon3DScene } from "./EarthMoon3DScene";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";
import { Scene2Content } from "./Scene2Content";

export enum SCENE {
  "ONE",
  "TWO",
}

const fadeOut = {
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
};

export const Hero = () => {
  const router = useRouter();
  const [scene, setScene] = useState<SCENE>(SCENE.ONE);

  const [scene1props, apiScene1] = useSpring(() => ({
    from: {
      opacity: 1,
    },
  }));
  const [scene2props, apiScene2] = useSpring(() => ({
    from: {
      opacity: 1,
    },
  }));

  const handleScene1ButtonClick = () => {
    apiScene1.start({
      ...fadeOut,
      onRest: () => {
        setScene(SCENE.TWO);
      },
    });
  };

  const handleScene2ButtonClick = () => {
    apiScene2.start({
      ...fadeOut,
      onRest: () => {
        router.push(paths.tripsList());
      },
    });
  };

  return (
    <>
      <EarthMoon3DScene className="absolute inset-0" scene={scene} />
      {scene === SCENE.ONE && (
        <animated.div style={scene1props}>
          <Scene1Content onButtonClick={handleScene1ButtonClick} />
        </animated.div>
      )}
      {scene === SCENE.TWO && (
        <animated.div style={scene2props}>
          <Scene2Content onButtonClick={handleScene2ButtonClick} />
        </animated.div>
      )}
    </>
  );
};
