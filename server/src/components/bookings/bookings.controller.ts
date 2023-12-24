import { InternalServerError } from "../../errors/InternalServerError";
import { CreateBooking } from "../../types";
import * as tripsService from "../trips/trips.service";
import * as usersService from "../users/users.service";
import * as roomsService from "../rooms/rooms.service";
import * as flightsService from "../flights/flights.service";
import * as bookingsService from "./bookings.service";

export const getBooking = async (bookingNumber: string) => {
    const booking =
        await bookingsService.getBookingByBookingNumber(bookingNumber);
    const room = await roomsService.getRoomByBooking(booking);
    return { ...booking, room };
};

export const createBooking = async (data: CreateBooking) => {
    const user = await usersService.getUserById(data.userId);
    const trip = await tripsService.getTripById(data.tripId);

    if (!trip.flightToMoon.id) {
        throw new InternalServerError(
            `Flight to Moon ${trip.flightToMoon.flightNumber} on ${trip.flightToMoon.departureTime} not found.`,
        );
    }
    if (!trip.flightToEarth.id) {
        throw new InternalServerError(
            `Flight to Earth ${trip.flightToEarth.flightNumber} on ${trip.flightToEarth.departureTime} not found.`,
        );
    }

    if (trip.occupancy + data.numberOfGuests > trip.capacity) {
        throw new InternalServerError(
            `Not enough capacity for this trip. Maximum occupancy is ${trip.capacity} and current occupancy is ${trip.occupancy}.`,
        );
    }

    const room = await roomsService.getRoomForTrip(
        trip,
        data.roomType,
        data.numberOfGuests,
    );
    const flightToMoonSeats = await flightsService.getAvailableSeats(
        trip.flightToMoon,
        data.numberOfGuests,
    );
    const flightToEarthSeats = await flightsService.getAvailableSeats(
        trip.flightToEarth,
        data.numberOfGuests,
    );

    return bookingsService.createAndSaveBooking({
        trip,
        user,
        room,
        flightToMoonSeats,
        flightToEarthSeats,
        numberOfGuests: data.numberOfGuests,
        guestNames: data.guestNames,
    });
};
