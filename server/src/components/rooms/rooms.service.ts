import { RoomType } from "../../constants";
import { InternalServerError } from "../../errors/InternalServerError";
import { Booking } from "../../models/Booking";
import { Trip } from "../../models/Trip";
import { roomOccupancyRepository } from "../../repositories/roomOccupancyRepository";
import { roomRepository } from "../../repositories/roomRepository";

export const getRoomForTrip = async (
    trip: Trip,
    roomType: RoomType,
    numberOfGuests: number,
) => {
    if (numberOfGuests > 2) {
        throw new InternalServerError(
            `Cannot book a room for more than 2 guests.`,
        );
    }

    const roomsTaken = await roomOccupancyRepository.find({
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

    const availableRoomsOfChosenType = await roomRepository.find({
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
        throw new InternalServerError(
            `No rooms of type ${roomType} available for this trip.`,
        );
    }

    return availableRoomsForTrip[0];
};

export const getRoomByBooking = async (booking: Booking) => {
    const roomOccupancy = await roomOccupancyRepository.findByBooking(booking);
    if (!roomOccupancy) {
        throw new InternalServerError(
            `Room for booking with ${booking.bookingNumber} not found.`,
        );
    }
    return roomOccupancy.room;
};
