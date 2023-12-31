import {
    generateBookingNumber,
    getBookingByBookingNumber,
    getBookingsByUser,
    createAndSaveBooking,
    BookingData,
} from "./bookings.service";
import { appDataSource } from "../../db/app-data-source";
import { bookingRepository } from "../../repositories/bookingRepository";
import { roomOccupancyRepository } from "../../repositories/roomOccupancyRepository";
import { flightOccupancyRepository } from "../../repositories/flightOccupancyRepository";
import { InternalServerError } from "../../errors/InternalServerError";
import { User } from "../../models/User";
import { BookingRecord } from "../../types";
import { DBUserMock } from "../../__mocks__/userMock";
import { roomMock } from "../../__mocks__/roomMock";
import { DBBookingMock } from "../../__mocks__/bookingMock";

jest.mock("../../db/app-data-source");
jest.mock("../../repositories/bookingRepository", () => {
    return {
        bookingRepository: {
            findByBookingNumber: jest.fn(),
            findByUser: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        },
    };
});
jest.mock("../../repositories/roomOccupancyRepository", () => {
    return {
        roomOccupancyRepository: {
            create: jest.fn(),
            save: jest.fn(),
        },
    };
});
jest.mock("../../repositories/flightOccupancyRepository", () => {
    return {
        flightOccupancyRepository: {
            create: jest.fn(),
            save: jest.fn(),
        },
    };
});

describe("Bookings Service", () => {
    describe("generateBookingNumber", () => {
        it("should generate a booking number of the specified length", () => {
            const length = 8;
            const bookingNumber = generateBookingNumber(length);
            expect(bookingNumber).toHaveLength(length);
        });
    });

    describe("getBookingByBookingNumber", () => {
        it("should throw InternalServerError if booking is not found", async () => {
            const bookingNumber = "1234567890";
            (
                bookingRepository.findByBookingNumber as jest.Mock
            ).mockResolvedValueOnce(null);

            await expect(
                getBookingByBookingNumber(bookingNumber),
            ).rejects.toThrow(InternalServerError);
            expect(
                bookingRepository.findByBookingNumber as jest.Mock,
            ).toHaveBeenCalledWith(bookingNumber);
        });

        it("should return the booking if found", async () => {
            const bookingNumber = "1234567890";
            const booking: BookingRecord = {
                ...DBBookingMock,
            };
            (
                bookingRepository.findByBookingNumber as jest.Mock
            ).mockResolvedValueOnce(booking);

            const result = await getBookingByBookingNumber(bookingNumber);
            expect(result).toBe(booking);
            expect(
                bookingRepository.findByBookingNumber as jest.Mock,
            ).toHaveBeenCalledWith(bookingNumber);
        });
    });

    describe("getBookingsByUser", () => {
        it("should return bookings for the specified user", async () => {
            const user: User = { ...DBUserMock };
            const bookings: BookingRecord[] = [{ ...DBBookingMock }];
            (bookingRepository.findByUser as jest.Mock).mockResolvedValueOnce(
                bookings,
            );

            const result = await getBookingsByUser(user);
            expect(result).toBe(bookings);
            expect(bookingRepository.findByUser).toHaveBeenCalledWith(user);
        });
    });

    describe("createAndSaveBooking", () => {
        const flightToMoonSeats = ["1", "2"];
        const flightToEarthSeats = ["3", "4"];
        const bookingData: BookingData = {
            trip: {
                ...DBBookingMock.trip,
            },
            user: {
                ...DBBookingMock.user,
            },
            room: {
                ...roomMock,
            },
            flightToMoonSeats,
            flightToEarthSeats,
            numberOfGuests: DBBookingMock.numberOfGuests,
            guestNames: DBBookingMock.guestNames,
        };

        it("should create and save a booking", async () => {
            const booking: BookingRecord = { ...DBBookingMock };
            const transactionalEntityManager = { save: jest.fn() };
            const roomOccupancy = {
                booking,
                trip: bookingData.trip,
                room: bookingData.room,
                numberOfOccupants: bookingData.numberOfGuests,
            };
            const flightToMoonOccupancies = flightToMoonSeats.map((seat) => {
                return {
                    booking,
                    flight: bookingData.trip.flightToMoon,
                    seatNumber: seat,
                };
            });
            const flightToEarthOccupancies = flightToEarthSeats.map((seat) => {
                return {
                    booking,
                    flight: bookingData.trip.flightToEarth,
                    seatNumber: seat,
                };
            });
            (appDataSource.transaction as jest.Mock).mockImplementationOnce(
                async (callback) => {
                    await callback(transactionalEntityManager);
                    return DBBookingMock;
                },
            );
            (bookingRepository.create as jest.Mock).mockReturnValueOnce(
                booking,
            );
            (roomOccupancyRepository.create as jest.Mock).mockReturnValueOnce(
                roomOccupancy,
            );

            (flightOccupancyRepository.create as jest.Mock)
                .mockReturnValueOnce(flightToMoonOccupancies[0])
                .mockReturnValueOnce(flightToMoonOccupancies[1])
                .mockReturnValueOnce(flightToEarthOccupancies[0])
                .mockReturnValueOnce(flightToEarthOccupancies[1]);

            const result = await createAndSaveBooking(bookingData);
            expect(result).toEqual(booking);

            expect(appDataSource.transaction).toHaveBeenCalled();
            expect(bookingRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: bookingData.user,
                    trip: bookingData.trip,
                    numberOfGuests: bookingData.numberOfGuests,
                    guestNames: bookingData.guestNames,
                    bookingNumber: expect.any(String),
                    status: "pending_payment",
                }),
            );
            expect(roomOccupancyRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    booking,
                    trip: bookingData.trip,
                    room: bookingData.room,
                    numberOfOccupants: bookingData.numberOfGuests,
                }),
            );
            expect(
                (flightOccupancyRepository.create as jest.Mock).mock.calls,
            ).toEqual(
                expect.arrayContaining([
                    [flightToMoonOccupancies[0]],
                    [flightToMoonOccupancies[1]],
                    [flightToEarthOccupancies[0]],
                    [flightToEarthOccupancies[1]],
                ]),
            );
            expect(transactionalEntityManager.save.mock.calls).toEqual(
                expect.arrayContaining([
                    [bookingData.trip],
                    [booking],
                    [roomOccupancy],
                    [flightToMoonOccupancies[0]],
                    [flightToMoonOccupancies[1]],
                    [flightToEarthOccupancies[0]],
                    [flightToEarthOccupancies[1]],
                ]),
            );
        });

        it("should throw InternalServerError if an error occurs", async () => {
            const error = new Error("Test error");
            (appDataSource.transaction as jest.Mock).mockRejectedValueOnce(
                error,
            );

            await expect(createAndSaveBooking(bookingData)).rejects.toThrow(
                InternalServerError,
            );
            expect(appDataSource.transaction).toHaveBeenCalled();
        });
    });
});
