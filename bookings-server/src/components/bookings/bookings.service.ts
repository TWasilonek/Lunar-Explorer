import { getDataSource } from "../../db/dataSource";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";
import { Booking } from "../../models/Booking";
import { Room } from "../../models/Room";
import { Trip } from "../../models/Trip";
import { User } from "../../models/User";
import { getBookingRepository } from "../../repositories/bookingRepository";
import { getFlightOccupancyRepository } from "../../repositories/flightOccupancyRepository";
import { getRoomOccupancyRepository } from "../../repositories/roomOccupancyRepository";

export type BookingData = {
    user: User;
    trip: Trip;
    room: Room;
    flightToMoonSeats: string[];
    flightToEarthSeats: string[];
    numberOfGuests: number;
    guestNames: string[];
};

export const generateBookingNumber = (length = 10) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingNumber = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        bookingNumber += characters.charAt(randomIndex);
    }
    return bookingNumber;
};

export const getBookingByBookingNumber = async (bookingNumber: string) => {
    const booking =
        await getBookingRepository().findByBookingNumber(bookingNumber);
    if (!booking) {
        throw new NotFoundError(
            `Booking with booking number: "${bookingNumber}" not found.`,
        );
    }

    return booking;
};

export const getBookingsByUser = async (user: User) => {
    return getBookingRepository().findByUser(user);
};

const createBookingTransaction = async ({
    trip,
    user,
    room,
    flightToMoonSeats,
    flightToEarthSeats,
    numberOfGuests,
    guestNames,
}: BookingData): Promise<Booking> =>
    getDataSource().transaction(async (transactionalEntityManager) => {
        trip.occupancy += numberOfGuests;
        await transactionalEntityManager.save(trip);

        const booking = getBookingRepository().create({
            user,
            trip,
            numberOfGuests: numberOfGuests,
            guestNames: guestNames,
            bookingNumber: generateBookingNumber(),
            status: "pending_payment",
        });
        await transactionalEntityManager.save(booking);

        const roomOccupancy = getRoomOccupancyRepository().create({
            booking,
            trip,
            room,
            numberOfOccupants: numberOfGuests,
        });
        await transactionalEntityManager.save(roomOccupancy);

        const flightOccupancyRepository = getFlightOccupancyRepository();
        const seatsPromises = flightToMoonSeats.map((seat) => {
            const flightOccupancy = flightOccupancyRepository.create({
                booking,
                flight: trip.flightToMoon,
                seatNumber: seat,
            });
            return transactionalEntityManager.save(flightOccupancy);
        });

        const flightOccupancyPromises = flightToEarthSeats.map((seat) => {
            const flightOccupancy = flightOccupancyRepository.create({
                booking,
                flight: trip.flightToEarth,
                seatNumber: seat,
            });
            return transactionalEntityManager.save(flightOccupancy);
        });

        await Promise.all(seatsPromises);
        await Promise.all(flightOccupancyPromises);

        return booking;
    });

export const createAndSaveBooking = async (bookingData: BookingData) => {
    try {
        const booking = await createBookingTransaction(bookingData);
        return booking;
    } catch (error) {
        console.error(error);
        throw new InternalServerError("Could not create booking");
    }
};
