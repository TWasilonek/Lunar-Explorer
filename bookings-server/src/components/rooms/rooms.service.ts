import { RoomType } from "../../constants";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { Booking } from "../../models/Booking";
import { Trip } from "../../models/Trip";
import { BookingRecord } from "../../repositories/bookingRepository";
import { getRoomOccupancyRepository } from "../../repositories/roomOccupancyRepository";
import { getRoomRepository } from "../../repositories/roomRepository";

export const getRoomForTrip = async (
    trip: Trip,
    roomType: RoomType,
    numberOfGuests: number,
) => {
    if (numberOfGuests > 2) {
        throw new BadRequestError(`Cannot book a room for more than 2 guests.`);
    }

    const roomsTaken = await getRoomOccupancyRepository().find({
        where: {
            trip: {
                id: trip.id,
            },
        },
        relations: {
            room: true,
            trip: true,
        },
    });

    const availableRoomsOfChosenType = await getRoomRepository().find({
        where: {
            capacity: roomType === RoomType.SINGLE ? 1 : 2,
        },
    });

    const availableRoomsForTrip = availableRoomsOfChosenType.filter((room) => {
        return !roomsTaken.some((occupiedRoom) => {
            return occupiedRoom.room.id === room.id;
        });
    });

    if (availableRoomsForTrip.length < 1) {
        throw new BadRequestError(
            `No rooms of type ${roomType} available for this trip.`,
        );
    }

    return availableRoomsForTrip[0];
};

export const getRoomByBooking = async (booking: BookingRecord) => {
    const roomOccupancy =
        await getRoomOccupancyRepository().findByBooking(booking);
    if (!roomOccupancy) {
        throw new NotFoundError(
            `Room for booking with ${booking.bookingNumber} not found.`,
        );
    }
    return roomOccupancy.room;
};
