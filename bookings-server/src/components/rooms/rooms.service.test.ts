import { getRoomForTrip, getRoomByBooking } from "./rooms.service";
import { RoomType } from "../../types";
import { Trip } from "../../models/Trip";
import { RoomOccupancyRecord } from "../../repositories/roomOccupancyRepository";
import { DBTripMock } from "../../__mocks__/tripMock";
import { Room } from "../../models/Room";
import { BadRequestError } from "../../errors/BadRequestError";
import { DBBookingMock } from "../../__mocks__/bookingMock";
import { BookingRecord } from "../../repositories/bookingRepository";
import { NotFoundError } from "../../errors/NotFoundError";
import { mockRoomOccupancyRecord } from "../../__mocks__/roomOccupancyMock";

const mockRoomOccupancyRepository = {
    find: jest.fn(),
    findByBooking: jest.fn(),
};
jest.mock("../../repositories/roomOccupancyRepository", () => ({
    getRoomOccupancyRepository: jest.fn().mockImplementation(() => {
        return mockRoomOccupancyRepository;
    }),
}));

const mockRoomRepository = {
    find: jest.fn(),
};
jest.mock("../../repositories/roomRepository", () => {
    return {
        getRoomRepository: jest.fn().mockImplementation(() => {
            return mockRoomRepository;
        }),
    };
});

describe("Rooms service", () => {
    describe("getRoomForTrip", () => {
        beforeAll(() => {
            jest.spyOn(console, "error").mockImplementation(() => {});
        });
        afterAll(() => {
            jest.restoreAllMocks();
        });

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return the first available room of the chosen type", async () => {
            const trip: Trip = { ...DBTripMock };
            const roomType = RoomType.SINGLE;
            const numberOfGuests = 1;
            const roomsTaken: RoomOccupancyRecord[] = [
                { ...mockRoomOccupancyRecord },
            ];
            const availableRoomsOfChosenType: Room[] = [
                {
                    id: 2,
                    capacity: 1,
                    roomNumber: "2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    mainPhotoUrl: "",
                },
                {
                    id: 3,
                    capacity: 1,
                    roomNumber: "3",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    mainPhotoUrl: "",
                },
            ];
            mockRoomOccupancyRepository.find.mockResolvedValueOnce(roomsTaken);
            mockRoomRepository.find.mockResolvedValueOnce(
                availableRoomsOfChosenType,
            );

            const result = await getRoomForTrip(trip, roomType, numberOfGuests);

            expect(result).toEqual(availableRoomsOfChosenType[0]);
        });

        it("should throw an error if numberOfGuests is greater than 2", async () => {
            const trip: Trip = { ...DBTripMock };
            const roomType = RoomType.SINGLE;
            const numberOfGuests = 3;

            await expect(
                getRoomForTrip(trip, roomType, numberOfGuests),
            ).rejects.toThrow(BadRequestError);
        });

        it("should throw an error if no available rooms of the chosen type", async () => {
            const trip: Trip = { ...DBTripMock };
            const roomType = RoomType.SINGLE;
            const numberOfGuests = 2;

            mockRoomRepository.find.mockResolvedValueOnce([]);

            await expect(
                getRoomForTrip(trip, roomType, numberOfGuests),
            ).rejects.toThrow(BadRequestError);
        });
    });

    describe("getRoomByBooking", () => {
        it("should return the room associated with the booking", async () => {
            const booking: BookingRecord = { ...DBBookingMock };
            const roomOccupancy = { ...mockRoomOccupancyRecord };
            mockRoomOccupancyRepository.findByBooking.mockResolvedValueOnce(
                roomOccupancy,
            );
            const result = await getRoomByBooking(booking);
            expect(result).toEqual(roomOccupancy.room);
        });

        it("should throw an error if room occupancy not found for the booking", async () => {
            const booking: BookingRecord = { ...DBBookingMock };
            mockRoomOccupancyRepository.findByBooking.mockResolvedValueOnce(
                null,
            );
            await expect(getRoomByBooking(booking)).rejects.toThrow(
                NotFoundError,
            );
        });
    });
});
