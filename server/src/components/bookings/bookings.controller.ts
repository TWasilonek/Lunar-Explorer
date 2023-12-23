import { appDataSource } from "../../db/app-data-source";
import { InternalServerError } from "../../errors/InternalServerError";
import { Flight } from "../../models/Flight";
import { Spaceship } from "../../models/Spaceship";
import { bookingRepository } from "../../repositories/bookingRepository";
import { flightOccupancyRepository } from "../../repositories/flightOccupancyRepository";
import { flightRepository } from "../../repositories/flightRepository";
import { roomOccupancyRepository } from "../../repositories/roomOccupancyRepository";
import { roomRepository } from "../../repositories/roomRepository";
import { tripRepository } from "../../repositories/tripRepository";
import { SaveBooking } from "../../types";
import { Trip } from "../../models/Trip";
import { userRepository } from "../../repositories/userRepository";
import { generateBookingNumber } from "../../utils/generateBookingNumbers";
import { FlightOccupancy } from "../../models/FlightOccupancy";
import { Booking } from "../../models/Booking";
import { RoomOccupancy } from "../../models/RoomOccupancy";

const getSeatsInShip = (spaceship: Spaceship) => {
    const seats = [];
    for (let i = 1; i <= spaceship.totalSeats; i++) {
        seats.push(`${i}`);
    }
    return seats;
};

const getAvailableSeats = async (flight: Flight, numberOfGuests: number) => {
    const allSeats = getSeatsInShip(flight.spaceship);
    const takenSeats = await flightOccupancyRepository.find({
        where: {
            flight: {
                id: flight.id,
            },
        },
    });

    // If the available seats for a flight are less than the required ones for the booking, throw an error
    const availableSeats = allSeats.filter((seat) => {
        return !takenSeats.some((takenSeat) => {
            return takenSeat.seatNumber === seat;
        });
    });

    if (availableSeats.length < numberOfGuests) {
        throw new InternalServerError(
            `Not enough seats available for this flight.`,
        );
    }

    return availableSeats.slice(0, numberOfGuests);
};

const getRoomForTrip = async (trip: Trip, roomType: string) => {
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
            capacity: roomType === "single" ? 1 : 2,
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

export const createBooking = async (data: SaveBooking) => {
    const user = await userRepository.findById(data.userId);
    if (!user) {
        throw new InternalServerError(`User with id ${data.userId} not found.`);
    }

    const trip = await tripRepository.findOne({
        where: {
            id: +data.tripId,
        },
        relations: {
            flightToMoon: {
                spaceship: true,
            },
            flightToEarth: {
                spaceship: true,
            },
        },
    });

    if (!trip) {
        throw new InternalServerError(`Trip with id ${data.tripId} not found.`);
    }

    if (!trip.flightToMoon.id) {
        throw new InternalServerError(`Flight ${trip.flightToMoon} not found.`);
    }
    if (!trip.flightToEarth.id) {
        throw new InternalServerError(
            `Flight ${trip.flightToEarth} not found.`,
        );
    }

    const room = await getRoomForTrip(trip, data.roomType);
    const flightToMoonSeats = await getAvailableSeats(
        trip.flightToMoon,
        data.numberOfGuests,
    );
    const flightToEarthSeats = await getAvailableSeats(
        trip.flightToEarth,
        data.numberOfGuests,
    );

    let booking = null;

    try {
        await appDataSource.transaction(async (transactionalEntityManager) => {
            booking = bookingRepository.create({
                user,
                trip,
                numberOfGuests: data.numberOfGuests,
                guestNames: data.guestNames,
                bookingNumber: generateBookingNumber(),
                status: "pending_payment",
            });
            await transactionalEntityManager.save(booking);

            const roomOccupancy = roomOccupancyRepository.create({
                booking,
                trip,
                room,
                numberOfOccupants: data.numberOfGuests,
            });
            await transactionalEntityManager.save(roomOccupancy);

            // console.log("\n\n========== BOOKING: ", booking);
            // console.log("\n\n========== ROOM OCCUPANCY: ", roomOccupancy);

            for (let seat of flightToMoonSeats) {
                const flightOccupancy = flightOccupancyRepository.create({
                    booking,
                    flight: trip.flightToMoon,
                    seatNumber: seat,
                });
                await transactionalEntityManager.save(flightOccupancy);
            }

            for (let seat of flightToEarthSeats) {
                const flightOccupancy = flightOccupancyRepository.create({
                    booking,
                    flight: trip.flightToEarth,
                    seatNumber: seat,
                });
                await transactionalEntityManager.save(flightOccupancy);
            }

            // TODO: update trip occupancy
        });

        return booking;
    } catch (error) {
        console.error(error);
        throw new InternalServerError("Could not create booking");
    }
};
