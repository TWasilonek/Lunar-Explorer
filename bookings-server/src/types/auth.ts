import { UserRole } from "./constants";

export type SignupResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};
