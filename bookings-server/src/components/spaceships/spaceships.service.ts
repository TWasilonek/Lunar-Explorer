import { Spaceship } from "../../models/Spaceship";

export const getSeatsInShip = (spaceship: Spaceship) => {
    const seats = [];
    for (let i = 1; i <= spaceship.totalSeats; i++) {
        seats.push(`${i}`);
    }
    return seats;
};
