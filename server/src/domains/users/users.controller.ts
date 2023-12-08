import bcrypt from "bcryptjs";
import { usersRepository } from "./users.repository";
import { ReturnUser, SaveUser } from "./types";

const saveAndReturnUser = async (user: SaveUser): Promise<ReturnUser> => {
    const savedUser = await usersRepository.save(user);
    return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
    };
};

export const getAllUsers = async () => {
    return usersRepository.find();
};

export const getUserById = async (userId: string) => {
    const user = await usersRepository.findById(userId);
    if (!user) {
        throw Error("User not found");
    }

    return user;
};

export const createUser = async (user: SaveUser): Promise<ReturnUser> => {
    const newUser = usersRepository.create({
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim().toLowerCase(),
        password: bcrypt.hashSync(user.password, 8),
    });

    return saveAndReturnUser(newUser);
};

export const updateUser = async (userId: string, data: Partial<SaveUser>) => {
    const user = await getUserById(userId);

    const sanitizedData = {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim().toLowerCase(),
    };

    usersRepository.merge(user, sanitizedData);
    return saveAndReturnUser(user);
};

export const deleteUser = async (userId: string) => {
    await getUserById(userId);
    await usersRepository.delete(userId);
};
