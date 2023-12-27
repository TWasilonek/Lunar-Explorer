import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../../config/authConfig";
import { User } from "../../models/User";
import { isProduction } from "../../utils/env";

export const authenticate = async (user: User, password: string) => {
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        throw Error("Invalid password.");
    }

    if (!authConfig.secret) {
        console.error('There is no "secret"');
        throw Error("Something went wront. Try again later.");
    }

    const accessToken = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: isProduction() ? "10m" : "1h",
    });

    const refreshToken = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: "1d",
    });

    return { accessToken, refreshToken };
};

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password);
};
