import { NotFoundError } from "../../errors/NotFoundError";
import { User } from "../../models/User";
import { userRepository } from "../../repositories/userRepository";
import { SaveUser } from "./users.controller";

export const getAllUsers = async () => {
    return userRepository.find();
};

export const getUserById = async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
};

export const getUserByEmail = async (email: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
};

export const createAndSaveUser = async (data: SaveUser) => {
    const newUser = userRepository.create(data);
    return await userRepository.save(newUser);
};

export const updateAndSaveUser = async (user: User, data: Partial<User>) => {
    userRepository.merge(user, data);
    return userRepository.save(user);
};

export const deleteUser = async (userId: string) => {
    const user = await getUserById(userId);
    await userRepository.delete(userId);
    return user;
};
