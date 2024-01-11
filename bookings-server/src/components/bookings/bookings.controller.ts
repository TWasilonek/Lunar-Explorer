import { InternalServerError } from "../../errors/InternalServerError";
import * as tripsService from "../trips/trips.service";
import * as usersService from "../users/users.service";
import * as roomsService from "../rooms/rooms.service";
import * as flightsService from "../flights/flights.service";
import * as bookingsService from "./bookings.service";
import { CreateBookingBody, CreateBookingResponse } from "../../types/bookings";

export const getBooking = async (bookingNumber: string) => {
    const booking =
        await bookingsService.getBookingByBookingNumber(bookingNumber);
    const room = await roomsService.getRoomByBooking(booking);
    const seatsToMoon = await flightsService.getSeatsByBooking(
        booking,
        booking.trip.flightToMoon,
    );
    const seatsToEarth = await flightsService.getSeatsByBooking(
        booking,
        booking.trip.flightToEarth,
    );

    return {
        ...booking,
        trip: {
            ...booking.trip,
            flightToMoon: {
                ...booking.trip.flightToMoon,
                seats: seatsToMoon,
            },
            flightToEarth: {
                ...booking.trip.flightToEarth,
                seats: seatsToEarth,
            },
        },
        user: {
            id: booking.user.id,
            firstName: booking.user.firstName,
            lastName: booking.user.lastName,
            email: booking.user.email,
            role: booking.user.role,
        },
        room,
    };
};

export const createBooking = async (
    data: CreateBookingBody,
): Promise<CreateBookingResponse | null> => {
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
    const booking = await bookingsService.createAndSaveBooking({
        trip,
        user,
        room,
        flightToMoonSeats,
        flightToEarthSeats,
        numberOfGuests: data.numberOfGuests,
        guestNames: data.guestNames,
    });

    if (!booking) {
        return null;
    }

    return {
        ...booking,
        trip: {
            ...booking.trip,
            flightToMoon: {
                ...booking.trip.flightToMoon,
                seats: flightToMoonSeats,
            },
            flightToEarth: {
                ...booking.trip.flightToEarth,
                seats: flightToEarthSeats,
            },
        },
        user: {
            id: booking.user.id,
            firstName: booking.user.firstName,
            lastName: booking.user.lastName,
            email: booking.user.email,
            role: booking.user.role,
        },
        room,
    };
};
