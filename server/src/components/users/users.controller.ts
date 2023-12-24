import * as usersService from "./users.service";
import { ReturnUser, SaveUser } from "../../types";

export const getAllUsers = async () => {
    return usersService.getAllUsers();
};

export const getUser = async (userId: string) => {
    return usersService.getUserById(userId);
};

export const updateUser = async (
    userId: string,
    data: Partial<SaveUser>,
): Promise<ReturnUser> => {
    const user = await usersService.getUserById(userId);

    const sanitizedData = {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim().toLowerCase(),
    };

    return usersService.updateAndSaveUser(user, sanitizedData);
};

export const deleteUser = async (userId: string) => {
    return usersService.deleteUser(userId);
};
