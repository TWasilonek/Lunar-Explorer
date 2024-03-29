import * as usersService from "../users/users.service";
import * as authService from "./auth.service";
import { InternalServerError } from "../../errors/InternalServerError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { SignupResponse } from "../../types";

export type NewUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export const signup = async (user: NewUser): Promise<SignupResponse> => {
    const sanitizedData = {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim().toLowerCase(),
        password: authService.hashPassword(user.password),
    };

    const savedUser = await usersService.createAndSaveUser(sanitizedData);
    return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
    };
};

export type LoginData = {
    password: string;
    email: string;
};
export const signin = async ({
    password,
    email,
}: LoginData): Promise<{
    user: SignupResponse;
    accessToken: string;
    refreshToken: string;
}> => {
    let user;
    try {
        user = await usersService.getUserByEmail(email);
    } catch (error) {
        console.error("Error getting user by email: ", error);
        throw new UnauthorizedError();
    }

    const { accessToken, refreshToken } = authService.authenticate(
        user,
        password,
    );

    await authService.saveRefreshToken(user, refreshToken);

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

export const logout = async (userId: string) => {
    try {
        const user = await usersService.getUserById(userId);
        await usersService.updateAndSaveUser(user, { refreshToken: null });
    } catch (error) {
        console.error("Error updating user with refreshToken: ", error);
        throw new InternalServerError();
    }
};

export const refreshTokens = async (
    refreshToken: string,
): Promise<{
    accessToken: string;
    refreshToken: string;
}> => {
    const decoded = await authService.validateRefreshToken(refreshToken);
    if (!decoded) {
        console.error("Decoding refresh token was not successful.");
        throw new InternalServerError();
    }

    const user = await usersService.getUserById(decoded.id);
    const accessToken = authService.createAccessToken(user);
    const newRefreshToken = authService.createRefreshToken(user);
    await authService.saveRefreshToken(user, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
};
