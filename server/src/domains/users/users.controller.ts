import bcrypt from "bcryptjs";
import { userRepository } from "./users.repository";
import { ReturnUser, SaveUser } from "./types";

const saveAndReturnUser = async (user: SaveUser): Promise<ReturnUser> => {
    const savedUser = await userRepository.save(user);
    return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
    };
};

export const getAllUsers = async () => {
    return userRepository.find();
};

export const getUserById = async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw Error("User not found");
    }

    return user;
};

export const createUser = async (user: SaveUser): Promise<ReturnUser> => {
    const newUser = userRepository.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: bcrypt.hashSync(user.password, 8),
    });

    return saveAndReturnUser(newUser);
};

export const updateUser = async (userId: string, data: Partial<SaveUser>) => {
    const user = await getUserById(userId);

    userRepository.merge(user, data);
    return saveAndReturnUser(user);
};

export const deleteUser = async (userId: string) => {
    await getUserById(userId);
    await userRepository.delete(userId);
};
