import { UserRole } from "./constants";

export type UpdateUserBody = {
    firstName: string;
    lastName: string;
    email: string;
};

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
};
