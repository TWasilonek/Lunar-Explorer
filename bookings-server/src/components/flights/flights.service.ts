import { BadRequestError } from "../../errors/BadRequestError";
import { Flight } from "../../models/Flight";
import { BookingRecord } from "../../repositories/bookingRepository";
import { getFlightOccupancyRepository } from "../../repositories/flightOccupancyRepository";
import { getSeatsInShip } from "../spaceships/spaceships.service";

export const getAvailableSeats = async (
    flight: Flight,
    numberOfGuests: number,
) => {
    const allSeats = getSeatsInShip(flight.spaceship);
    const takenSeats = await getFlightOccupancyRepository().find({
        where: {
            flight: {
                id: flight.id,
            },
        },
    });

    const availableSeats = allSeats.filter((seat) => {
        return !takenSeats.some((takenSeat) => {
            return takenSeat.seatNumber === seat;
        });
    });

    if (availableSeats.length < numberOfGuests) {
        throw new BadRequestError(
            `Not enough seats available for this flight.`,
        );
    }

    return availableSeats.slice(0, numberOfGuests);
};

export const getSeatsByBooking = async (
    booking: BookingRecord,
    flight: Flight,
): Promise<string[]> => {
    const takenSeats = await getFlightOccupancyRepository().find({
        where: {
            flight: {
                id: flight.id,
            },
        },
        relations: {
            booking: true,
        },
    });

    return takenSeats
        .filter((seat) => {
            return seat.booking.id === booking.id;
        })
        .map((seat) => {
            return seat.seatNumber;
        });
};
