import { BadRequestError } from "../../errors/BadRequestError";
import { Flight } from "../../models/Flight";
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

    // If the available seats for a flight are less than the required ones for the booking, throw an error
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
