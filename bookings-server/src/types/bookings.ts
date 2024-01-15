import { Booking } from "../models/Booking";
import { Flight } from "../models/Flight";
import { Room } from "../models/Room";
import { RoomType, UserRole } from "./constants";

export type CreateBookingFlightSegment = Flight & { seats: string[] };

export type CreateBookingTripSegment = Booking["trip"] & {
    flightToMoon: CreateBookingFlightSegment;
    flightToEarth: CreateBookingFlightSegment;
};

export type CreateBookingBody = {
    userId: string;
    tripId: number;
    roomType: RoomType;
    numberOfGuests: number;
    guestNames: string[];
};

export type CreateBookingResponse = {
    bookingNumber: string;
    id: string;
    status: Booking["status"];
    numberOfGuests: number;
    guestNames: string[];
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
    };
    trip: CreateBookingTripSegment;
    room: Room;
};

export type GetBookingResponse = CreateBookingResponse;
