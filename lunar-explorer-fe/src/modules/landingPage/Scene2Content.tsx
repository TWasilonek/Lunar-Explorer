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

export const Scene2Content = ({ onButtonClick }: Props) => {
  const titleProps = useSpring({
    ...slideInProps,
    delay: 6000,
  });

  const buttonProps = useSpring({
    ...slideInProps,
    delay: 7500,
  });

  return (
    <div className="absolute top-[150px] w-full flex flex-col items-center py-2 px-auto">
      <animated.h2 className="text-5xl font-bold" style={titleProps}>
        You can now see the Earth from the Moon!
      </animated.h2>
      <AnimatedButton
        className="mt-8 text-3xl p-8"
        size="lg"
        color="default"
        variant="bordered"
        onClick={onButtonClick}
        style={buttonProps}
      >
        Choose your trip
      </AnimatedButton>
    </div>
  );
};
