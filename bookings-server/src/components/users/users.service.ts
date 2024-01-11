import { NotFoundError } from "../../errors/NotFoundError";
import { User } from "../../models/User";
import { getUserRepository } from "../../repositories/userRepository";
import { UpdateUserBody } from "../../types";

export const getAllUsers = async () => {
    return getUserRepository().find();
};

export const getUserById = async (userId: string) => {
    const user = await getUserRepository().findById(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
};

export const getUserByEmail = async (email: string) => {
    const user = await getUserRepository().findByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
};

export const createAndSaveUser = async (data: UpdateUserBody) => {
    const userRepository = getUserRepository();
    const newUser = userRepository.create(data);
    return await userRepository.save(newUser);
};

export const updateAndSaveUser = async (user: User, data: Partial<User>) => {
    const userRepository = getUserRepository();
    userRepository.merge(user, data);
    return userRepository.save(user);
};

export const deleteUser = async (userId: string) => {
    const user = await getUserById(userId);
    await getUserRepository().delete(userId);
    return user;
};
