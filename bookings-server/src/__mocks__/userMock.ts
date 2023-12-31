import { ReturnUser } from "../components/users/users.controller";
import { UserRole } from "../constants";
import { User } from "../models/User";

export const userMock: ReturnUser = {
    id: "testId",
    email: "test@test.com",
    firstName: "testFirstName",
    lastName: "testLastName",
    role: UserRole.USER,
};

export const DBUserMock: User = {
    ...userMock,
    password: "testPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    refreshToken: "refreshToken",
};
