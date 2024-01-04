import { RoomOccupancyRecord } from "../repositories/roomOccupancyRepository";
import { DBTripMock } from "./tripMock";
import { DBBookingMock } from "./bookingMock";

export const mockRoomOccupancyRecord: RoomOccupancyRecord = {
    id: 1,
    room: {
        id: 1,
        capacity: 1,
        roomNumber: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        mainPhotoUrl: "",
    },
    // @ts-ignore we don't care abut the whole booking object
    booking: { ...DBBookingMock },
    numberOfOccupants: 1,
    trip: { ...DBTripMock },
    createdAt: new Date(),
    updatedAt: new Date(),
};
