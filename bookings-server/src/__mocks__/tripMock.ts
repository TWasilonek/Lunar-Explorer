import { Trip } from "../models/Trip";

export const tripMock = {
    id: 2,
    startDate: "2024-03-07T23:00:00.000Z",
    endDate: "2024-03-14T23:00:00.000Z",
    capacity: 15,
    occupancy: 2,
    status: "scheduled",
    flightToMoon: {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 3,
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
        },
    },
    flightToEarth: {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 4,
        flightNumber: "SX 2",
        departureTime: "2024-03-15T20:00:00.000Z",
        arrivalTime: "2024-03-16T03:00:00.000Z",
        status: "scheduled",
        spaceship: {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: 5,
            model: "Starship",
            name: "Ego I",
            totalSeats: 15,
        },
    },
};

export const DBTripMock: Trip = {
    ...tripMock,
    createdAt: new Date(),
    updatedAt: new Date(),
    flightToMoon: {
        ...tripMock.flightToMoon,
        spaceship: {
            ...tripMock.flightToMoon.spaceship,
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
            name: "Spaceport America",
            code: "SPCE",
            location: "New Mexico, USA",
        },
        destinationPort: {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: 2,
            name: "Spaceport Moon",
            code: "MOON",
            location: "Moon",
        },
    },
    flightToEarth: {
        ...tripMock.flightToEarth,
        spaceship: {
            ...tripMock.flightToEarth.spaceship,
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
            id: 2,
            name: "Spaceport Moon",
            code: "MOON",
            location: "Moon",
        },
        destinationPort: {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: 1,
            name: "Spaceport America",
            code: "SPCE",
            location: "New Mexico, USA",
        },
    },
};
