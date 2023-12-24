import { NotFoundError } from "../../errors/NotFoundError";
import { User } from "../../models/User";
import { userRepository } from "../../repositories/userRepository";
import { SaveUser } from "../../types";

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
    const savedUser = await userRepository.save(newUser);
    return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
    };
};

export const updateAndSaveUser = async (user: User, data: Partial<User>) => {
    userRepository.merge(user, data);
    const savedUser = await userRepository.save(user);
    return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
    };
};

export const deleteUser = async (userId: string) => {
    await getUserById(userId);
    return userRepository.delete(userId);
};
