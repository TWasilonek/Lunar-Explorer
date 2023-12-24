import * as usersService from "./users.service";
import * as roomsService from "../rooms/rooms.service";
import * as bookingsService from "../bookings/bookings.service";
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
