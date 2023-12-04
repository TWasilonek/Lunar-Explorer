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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: bcrypt.hashSync(user.password, 8),
    });

    return saveAndReturnUser(newUser);
};

export const updateUser = async (userId: string, data: Partial<SaveUser>) => {
    const user = await getUserById(userId);

    usersRepository.merge(user, data);
    return saveAndReturnUser(user);
};

export const deleteUser = async (userId: string) => {
    await getUserById(userId);
    await usersRepository.delete(userId);
};
