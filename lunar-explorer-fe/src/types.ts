import { SignupResponse } from "@bookings-server/types";
import { Session } from "next-auth";

export type UserFromJWT = SignupResponse & {
  accessToken: string;
  refreshTokenCookie: string;
  expiresAt: number;
};

export type UserSession = Session & {
  user: UserFromJWT;
  error?: string;
};
