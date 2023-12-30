import { Booking } from "../models/Booking";
import { BookingRecord, ReturnBooking } from "../types";
import { roomMock } from "./roomMock";
import { DBTripMock, tripMock } from "./tripMock";
import { DBUserMock, userMock } from "./userMock";

export const returnBookingMock: ReturnBooking = {
    id: "aacd1c3a-ae59-4a17-a04e-6a3917d99b45",
    bookingNumber: "KKPJ2CGRK7",
    status: "pending_payment",
    numberOfGuests: 1,
    guestNames: ["Johnny"],
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
        ...userMock,
    },
    // @ts-ignore
    trip: {
        ...tripMock,
    },

    room: {
        ...roomMock,
    },
};

export const DBBookingMock: BookingRecord = {
    ...returnBookingMock,
    user: {
        ...DBUserMock,
    },
    trip: {
        ...DBTripMock,
    },
};
