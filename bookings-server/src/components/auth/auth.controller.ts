import * as usersService from "../users/users.service";
import * as authService from "./auth.service";
import { ReturnUser, SaveUser } from "../../types";
import { InternalServerError } from "../../errors/InternalServerError";

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
        console.log("Decoding refresh token was not successful.");
        throw new InternalServerError();
    }

    const user = await usersService.getUserById(decoded.id);
    const accessToken = authService.createAccessToken(user);
    const newRefreshToken = authService.createRefreshToken(user);
    await authService.saveRefreshToken(user, refreshToken);

    return { accessToken, refreshToken: newRefreshToken };
};
