import { NotFoundError } from "../../errors/NotFoundError";
import { userRepository } from "../../repositories/userRepository";
import { ReturnUser, SaveUser } from "../../types";

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

export const updateUser = async (
    userId: string,
    data: Partial<SaveUser>,
): Promise<ReturnUser> => {
    const user = await getUserById(userId);

    const sanitizedData = {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim().toLowerCase(),
    };

    userRepository.merge(user, sanitizedData);
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
    await userRepository.delete(userId);
};
