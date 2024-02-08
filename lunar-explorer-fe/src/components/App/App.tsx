"use client";

import { ReactNode, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
import { paths } from "@/paths";

const CHECK_SESSION_EXP_TIME = 1000 * 60 * 0.5; // 30 seconds

export const App = ({ children }: { children: ReactNode }) => {
  const { data: session, update } = useSession();

  useEffect(() => {
    const checkUserSession = setInterval(() => {
      const expiresTimeTimestamp = Math.floor(
        new Date(session?.expires || "").getTime()
      );
      const currentTimestamp = Date.now();
      const timeRemaining = expiresTimeTimestamp - currentTimestamp;

      // If the user session will expire before the next session check
      // and the user is not idle, then we want to refresh the session
      // on the client and request a token refresh on the backend
      if (timeRemaining < CHECK_SESSION_EXP_TIME) {
        update(); // extend the client session
      } else if (timeRemaining < 0) {
        // session has expired, logout the user and display session expiration message
        signOut({ callbackUrl: paths.auth.login() + "?error=SessionExpired" });
      }
    }, 30);

    return () => {
      clearInterval(checkUserSession);
    };
  }, [session?.expires, update]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
