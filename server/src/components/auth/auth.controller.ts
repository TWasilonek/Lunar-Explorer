import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../../config/authConfig";
import { userRepository } from "../../repositories/userRepository";
import { ReturnUser, SaveUser } from "../../types";

export const signup = async (user: SaveUser): Promise<ReturnUser> => {
    const newUser = userRepository.create({
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim().toLowerCase(),
        password: bcrypt.hashSync(user.password, 8),
    });

    const savedUser = await userRepository.save(newUser);
    return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
    };
};

export const signin = async ({
    password,
    email,
}: Pick<SaveUser, "email" | "password">): Promise<
    ReturnUser & { accessToken: string }
> => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw Error("User not found.");
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        throw Error("Invalid password.");
    }

    if (!authConfig.secret) {
        console.error('There is no "secret"');
        throw Error("Something went wront. Try again later.");
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 3600 * 24, // 24 hours
    });

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: token,
        role: user.role,
    };
};
