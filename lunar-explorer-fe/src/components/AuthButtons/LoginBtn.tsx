"use client";

import { Button, ButtonProps, Link } from "@nextui-org/react";
import { signIn } from "next-auth/react";

type Props = ButtonProps;

export const LoginBtn = ({ variant = "light", ...rest }: Props) => {
  return (
    <Button
      className="text-base text-foreground data-[hover=true]:bg-transparent data-[hover=true]:text-primary-500"
      variant={variant}
      onClick={() => signIn()}
      {...rest}
    >
      Login
    </Button>
  );
};
