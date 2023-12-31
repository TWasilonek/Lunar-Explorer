import * as usersService from "./users.service";
import * as roomsService from "../rooms/rooms.service";
import * as bookingsService from "../bookings/bookings.service";
import { UserRole } from "../../constants";

export type SaveUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type ReturnUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
};

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

    const updatedUser = await usersService.updateAndSaveUser(
        user,
        sanitizedData,
    );
    return {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
    };
};

export const deleteUser = async (userId: string) => {
    const deletedUser = await usersService.deleteUser(userId);
    return {
        id: deletedUser.id,
        firstName: deletedUser.firstName,
        lastName: deletedUser.lastName,
        email: deletedUser.email,
        role: deletedUser.role,
    };
};

export const getUserBookings = async (userId: string) => {
    const user = await usersService.getUserById(userId);
    const bookings = await bookingsService.getBookingsByUser(user);

    const result = await Promise.all(
        bookings.map(async (booking) => {
            const room = await roomsService.getRoomByBooking(booking);
            return {
                ...booking,
                room,
            };
        }),
    );

    return result;
};
