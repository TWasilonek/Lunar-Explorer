"use client";

import { useSession } from "next-auth/react";
import { SingOutBtn, LoginBtn, RegisterBtn } from "../AuthButtons";

export const NavUserArea = () => {
  const session = useSession();

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  if (session.data?.user) {
    return <SingOutBtn />;
  }

  return (
    <div className="flex gap-2">
      <RegisterBtn />
      <LoginBtn />
    </div>
  );
};
