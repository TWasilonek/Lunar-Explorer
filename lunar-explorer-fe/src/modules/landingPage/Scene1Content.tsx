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
    <div className="absolute top-[200px] flex flex-col items-center py-2 px-12">
      <animated.h2 className="text-6xl font-bold" style={titleProps}>
        This is what you know
      </animated.h2>
      <animated.p className="mt-4 text-2xl" style={paragraphProps}>
        Until now, you&apos;ve only seen the moon from the Earth.
      </animated.p>
      <AnimatedButton
        className="mt-8 text-3xl text-foreground border-foreground"
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
