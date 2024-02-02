"use client";

import { Button } from "@nextui-org/react";
import { animated, useSpring } from "@react-spring/web";

const slideInProps = {
  from: {
    opacity: 0,
    y: -20,
  },
  to: {
    opacity: 1,
    y: 0,
  },
};

const AnimatedButton = animated(Button);

type Props = {
  onButtonClick: () => void;
};

export const Scene1Content = ({ onButtonClick }: Props) => {
  const titleProps = useSpring({
    ...slideInProps,
    delay: 2000,
  });

  const paragraphProps = useSpring({
    ...slideInProps,
    delay: 3000,
  });

  const buttonProps = useSpring({
    ...slideInProps,
    delay: 4000,
  });

  return (
    <div className="absolute top-[200px] flex flex-col items-center w-full lg:w-auto py-2 px-6 md:px-12">
      <animated.h2
        className="font-bold text-4xl md:text-6xl text-center lg:text-left"
        style={titleProps}
      >
        This is what you know
      </animated.h2>
      <animated.p
        className="mt-4 text-xl md:text-2xl text-center lg:text-left"
        style={paragraphProps}
      >
        Until now, you&apos;ve only seen the moon from the Earth.
      </animated.p>
      <AnimatedButton
        className="mt-8 text-3xl p-8 text-foreground border-foreground"
        size="lg"
        color="default"
        variant="bordered"
        style={buttonProps}
        onClick={onButtonClick}
      >
        We can change it
      </AnimatedButton>
    </div>
  );
};
