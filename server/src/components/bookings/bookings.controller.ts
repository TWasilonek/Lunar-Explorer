import { InternalServerError } from "../../errors/InternalServerError";
import { bookingRepository } from "../../repositories/bookingRepository";
import { roomOccupancyRepository } from "../../repositories/roomOccupancyRepository";
import { SaveBooking } from "../../types";

export const createBooking = async (data: SaveBooking) => {
    // save a booking record
    const booking = await bookingRepository.save({
        userId: data.userId,
        tripId: data.tripId,
        // roomType: data.roomType,
        numberOfGuests: data.numberOfGuests,
        guestNames: data.guestNames || [],
        // flightToMoonSeats: data.flightToMoonSeats,
        // flightToEarthSeats: data.flightToEarthSeats,
    });

    // save a room_occupancy record
    //    - choose a room id
    // TODO: find available room id -> craft a query that will tell you if
    //  - a roomId matching the given data.roomType on a given data.tripId is available
    const firstAvailableRoom = await roomOccupancyRepository.findOne({
        // where: { tripId: data.tripId  }
    });

    if (!firstAvailableRoom) {
        throw new InternalServerError(
            `No rooms of type ${data.roomType} available for this trip.`,
        );
    }

    await roomOccupancyRepository.save({
        booking: booking,
        tripId: data.tripId,
        roomId: firstAvailableRoom.id,
        numberOfOccupants: data.numberOfGuests,
    });

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

    return booking;
};
