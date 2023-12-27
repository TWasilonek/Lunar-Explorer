import * as usersService from "../users/users.service";
import * as authService from "./auth.service";
import { ReturnUser, SaveUser } from "../../types";

export const signup = async (user: SaveUser): Promise<ReturnUser> => {
    const sanitizedData = {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim().toLowerCase(),
        password: authService.hashPassword(user.password),
    };

    return usersService.createAndSaveUser(sanitizedData);
};

export const signin = async ({
    password,
    email,
}: Pick<SaveUser, "email" | "password">): Promise<{
    user: ReturnUser;
    accessToken: string;
    refreshToken: string;
}> => {
    const user = await usersService.getUserByEmail(email);
    const { accessToken, refreshToken } = await authService.authenticate(
        user,
        password,
    );

    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};
