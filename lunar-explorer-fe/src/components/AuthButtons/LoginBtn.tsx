"use client";

import { signIn } from "next-auth/react";

export const LoginBtn = () => {
  return <button onClick={() => signIn("credentials")}>Login</button>;
};