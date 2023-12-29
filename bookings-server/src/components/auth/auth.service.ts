import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../../config/authConfig";
import { User } from "../../models/User";
import { isProduction } from "../../utils/env";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import * as usersService from "../users/users.service";
import { InternalServerError } from "../../errors/InternalServerError";

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password);
};

export const createAccessToken = (user: User) => {
    if (!authConfig.jwt_secret) {
        console.error('There is no "jwt_secret"');
        throw new UnauthorizedError();
    }

    return jwt.sign({ id: user.id }, authConfig.jwt_secret, {
        expiresIn: isProduction() ? "10m" : "1h",
    });
};

export const createRefreshToken = (user: User) => {
    if (!authConfig.jwt_refresh_secret) {
        console.error('There is no "jwt_refresh_secret"');
        throw new UnauthorizedError();
    }

    return jwt.sign({ id: user.id }, authConfig.jwt_refresh_secret, {
        expiresIn: "1d",
    });
};

export const authenticate = (user: User, password: string) => {
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        console.error("Invalid password.");
        throw new UnauthorizedError();
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return { accessToken, refreshToken };
};

export const validateRefreshToken = async (refreshToken: string) => {
    if (!authConfig.jwt_refresh_secret) {
        console.error('There is no "jwt_refresh_secret"');
        throw new UnauthorizedError();
    }

    let decoded = null;

    try {
        decoded = jwt.verify(refreshToken, authConfig.jwt_refresh_secret);
    } catch (error) {
        console.error("Error validating refresh token: ", error);
        throw new UnauthorizedError();
    }

    if (typeof decoded === "string" || !decoded?.id) {
        console.log("Invalid refresh token. Decoded payload: ", decoded);
        throw new UnauthorizedError();
    }

    const user = await usersService.getUserById(decoded.id);
    if (user.refreshToken !== refreshToken || !user.refreshToken) {
        console.log("Invalid refresh token.");
        throw new UnauthorizedError();
    }

    return decoded;
};

export const saveRefreshToken = async (user: User, refreshToken: string) => {
    try {
        await usersService.updateAndSaveUser(user, { refreshToken });
    } catch (error) {
        console.error("Error updating user with refreshToken: ", error);
        throw new InternalServerError();
    }
};
