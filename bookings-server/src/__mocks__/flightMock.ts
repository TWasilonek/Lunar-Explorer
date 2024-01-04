import { Flight } from "../models/Flight";

export const flightMock: Flight = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    flightNumber: "SX 1",
    departureTime: "2024-03-08T17:00:00.000Z",
    arrivalTime: "2024-03-09T06:00:00.000Z",
    status: "scheduled",
    spaceship: {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 5,
        model: "Starship",
        name: "Ego I",
        totalSeats: 15,
        manufacturer: {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: 1,
            name: "SpaceX",
        },
    },
    originPort: {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 1,
        name: "Cape Canaveral Space Force Station",
        code: "CCSFS",
        location: "Cape Canaveral, Florida, USA",
    },
    destinationPort: {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 5,
        name: "Lunar Spaceport",
        code: "LSP",
        location: "Moon",
    },
};
