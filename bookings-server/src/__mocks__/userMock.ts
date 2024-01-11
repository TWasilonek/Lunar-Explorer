import { User } from "../models/User";
import { UserProfile, UserRole } from "../types";

export const userMock: UserProfile = {
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
