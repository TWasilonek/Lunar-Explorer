"use client";

import { signOut } from "next-auth/react";

export const SingOutBtn = () => {
  return (
    <div className="d-flex align-items-center">
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};
