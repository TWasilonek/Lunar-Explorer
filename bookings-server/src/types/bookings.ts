import { Booking } from "../models/Booking";
import { Room } from "../models/Room";
import { RoomType, UserRole } from "./constants";

export type CreateBookingBody = {
    userId: string;
    tripId: string;
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
    trip: Booking["trip"];
    room: Room;
};
