import { RoomType, UserRole } from "./constants";

export type SaveUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type ReturnUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
};

export type SaveBooking = {
    userId: string;
    tripId: string;
    roomType: RoomType;
    numberOfGuests: number;
    guestNames?: string[];
    flightToMoon: {
        flightId: string;
        seats: string[];
    };
    flightToEarth: {
        flightId: string;
        seats: string[];
    };
};
