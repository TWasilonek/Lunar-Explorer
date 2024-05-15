"use client";

import { ReactNode, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
import { paths } from "@/paths";
import { CHECK_SESSION_EXP_TIME, CHECK_SESSION_INTERVAL } from "@/constants";

export const App = ({ children }: { children?: ReactNode }) => {
  const { data: session, update } = useSession();

  useEffect(() => {
    const checkUserSession = setInterval(() => {
      const expiresTimeTimestamp = Math.floor(
        new Date(session?.expires || "").getTime()
      );
      const currentTimestamp = Date.now();
      const timeRemaining = expiresTimeTimestamp - currentTimestamp;

      if (CHECK_SESSION_EXP_TIME <= 0 && timeRemaining < 0) {
        // session has expired, logout the user and display session expiration message
        signOut({ callbackUrl: paths.auth.login() + "?error=SessionExpired" });
      } else if (timeRemaining < CHECK_SESSION_EXP_TIME) {
        // If the user session will expire before the next session check
        // and the user is not idle, then we want to refresh the session
        // on the client and request a token refresh on the backend
        update(); // extend the client session
      }
    }, CHECK_SESSION_INTERVAL);

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
