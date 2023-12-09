import { UserRole } from "../constants";

export const userMock = {
    id: "testId",
    email: "test@test.com",
    firstName: "testFirstName",
    lastName: "testLastName",
    role: UserRole.USER,
};

export const DBUserMock = {
    ...userMock,
    password: "testPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
};
