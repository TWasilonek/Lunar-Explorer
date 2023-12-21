import { appDataSource } from "../../db/app-data-source";
import { InternalServerError } from "../../errors/InternalServerError";
import { RoomOccupancy } from "../../models/RoomOccupancy";
import { bookingRepository } from "../../repositories/bookingRepository";
import { roomOccupancyRepository } from "../../repositories/roomOccupancyRepository";
import { roomRepository } from "../../repositories/roomRepository";
import { tripRepository } from "../../repositories/tripRepository";
import { SaveBooking } from "../../types";

export const createBooking = async (data: SaveBooking) => {
    // TODO: This all should happen inside a transaction

    // save a booking record
    // const booking = await bookingRepository.save({
    //     userId: data.userId,
    //     tripId: data.tripId,
    //     // roomType: data.roomType,
    //     numberOfGuests: data.numberOfGuests,
    //     guestNames: data.guestNames || [],
    //     // flightToMoonSeats: data.flightToMoonSeats,
    //     // flightToEarthSeats: data.flightToEarthSeats,
    // });

    // const trip = await tripRepository.findById(data.tripId);
    // if (!trip) {
    //     throw new InternalServerError(`Trip with id ${data.tripId} not found.`);
    // }

    // check if there are any rooms of the given type available for this trip

    // occupied rooms for this trip
    const occupiedRoomsForTrip = await roomOccupancyRepository.find({
        where: {
            trip: {
                id: +data.tripId,
            },
        },
        relations: {
            room: true,
            trip: true,
        },
    });

    // not occupied rooms for this trip of the given type
    const roomsForType = await roomRepository.find({
        where: {
            capacity: data.roomType === "single" ? 1 : 2,
        },
    });

    const availableRoomsForTrip = roomsForType.filter((room) => {
        return !occupiedRoomsForTrip.some((occupiedRoom) => {
            return occupiedRoom.room.id === room.id;
        });
    });

    // console.log("roomsForTrip", occupiedRoomsForTrip);
    // console.log("all available rooms for type", roomsForType);
    console.log("availableRoomsForTrip", availableRoomsForTrip);

    if (availableRoomsForTrip.length < 1) {
        throw new InternalServerError(
            `No rooms of type ${data.roomType} available for this trip.`,
        );
    }

    // save a room_occupancy record
    // await roomOccupancyRepository.save({
    //     booking: booking,
    //     tripId: data.tripId,
    //     room: availableRoomsForTrip[0],
    //     numberOfOccupants: data.numberOfGuests,
    // });

    // save a flight_occupancy record
    // TODO: THE USER CAN'T CHOOSE SEATS? in that case all logic is easier

    // TODO: find seats on flights by ID
    // 1. find trip by data.tripId
    // 2. for trips.flightToMoon :
    // - Get flightOccupancies by flightId where seats is any of chosen seats
    // - if taken, throw error with the info which seats taken
    // - if not taken, save new record
    // 3. and trips.flightToEarth:
    // - repeat

    // return booking;
    return null;
};
