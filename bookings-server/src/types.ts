import { RoomType, UserRole } from "./constants";
import { Booking } from "./models/Booking";
import { Room } from "./models/Room";

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

export type CreateBooking = {
    userId: string;
    tripId: string;
    roomType: RoomType;
    numberOfGuests: number;
    guestNames: string[];
};

export type ReturnBooking = {
    bookingNumber: string;
    id: string;
    status: Booking["status"];
    numberOfGuests: number;
    guestNames: string[];
    createdAt: Date;
    updatedAt: Date;
    user: ReturnUser;
    trip: Booking["trip"];
    room: Room;
};

export type BookingRecord = Omit<Booking, "logInsert">;
