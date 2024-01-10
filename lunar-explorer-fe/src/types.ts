import { SignupResponse } from "@bookings-server/types";

export type UserFromJWT = SignupResponse & {
  accessToken: string;
};
