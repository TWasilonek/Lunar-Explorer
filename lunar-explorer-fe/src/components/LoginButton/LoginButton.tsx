"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import * as actions from "@/actions";

export const LoginButton = () => {
  const session = useSession();
  console.log("data", session.data);
  console.log("status", session.status);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  if (session.data?.user) {
    return (
      <div className="d-flex align-items-center">
        {/* <form action={actions.signOut}>
        <button>Sign out</button>
        </form> */}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button>Sign up</button>
      {/* <form action={actions.signIn}>
        <button>Login</button>
      </form> */}
      <button onClick={() => signIn("credentials")}>Login</button>
    </div>
  );
};
