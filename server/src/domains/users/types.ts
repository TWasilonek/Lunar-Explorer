import { UserRole } from "../../constants";

export type SaveUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type ReturnUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
};
