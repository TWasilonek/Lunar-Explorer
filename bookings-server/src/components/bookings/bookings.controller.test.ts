import { getBooking, createBooking } from "./bookings.controller";
import * as bookingsService from "./bookings.service";
import * as roomsService from "../rooms/rooms.service";
import * as usersService from "../users/users.service";
import * as tripsService from "../trips/trips.service";
import * as flightsService from "../flights/flights.service";
import { InternalServerError } from "../../errors/InternalServerError";
import { CreateBookingBody, RoomType } from "../../types";
import { userMock } from "../../__mocks__/userMock";
import { tripMock } from "../../__mocks__/tripMock";
import { roomMock } from "../../__mocks__/roomMock";

jest.mock("./bookings.service");
jest.mock("../rooms/rooms.service");
jest.mock("../users/users.service");
jest.mock("../trips/trips.service");
jest.mock("../flights/flights.service");

describe("Bookings Controller", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getBooking", () => {
        it("should return the booking with user and room details", async () => {
            const bookingNumber = "123456";
            const booking = {
                id: "bookingId",
                bookingNumber,
                user: {
                    ...userMock,
                },
            };
            const room = {
                id: "roomId",
                name: "Room 101",
            };

            (
                bookingsService.getBookingByBookingNumber as jest.Mock
            ).mockResolvedValue(booking);
            (roomsService.getRoomByBooking as jest.Mock).mockResolvedValue(
                room,
            );

            const result = await getBooking(bookingNumber);

            expect(result).toEqual({
                ...booking,
                user: {
                    id: booking.user.id,
                    firstName: booking.user.firstName,
                    lastName: booking.user.lastName,
                    email: booking.user.email,
                    role: booking.user.role,
                },
                room,
            });
        });
    });

    describe("createBooking", () => {
        const data: CreateBookingBody = {
            userId: userMock.id,
            tripId: tripMock.id,
            roomType: RoomType.SINGLE,
            numberOfGuests: 1,
            guestNames: ["John Doe"],
        };
        const user = {
            ...userMock,
        };
        const trip = {
            ...tripMock,
        };
        const room = {
            ...roomMock,
        };

        it("should create a new booking and return it with user and room details", async () => {
            const flightToMoonSeats = ["1", "2"];
            const flightToEarthSeats = ["3", "4"];
            const booking = {
                id: "bookingId",
                trip,
                user,
                room,
                flightToMoonSeats,
                flightToEarthSeats,
                numberOfGuests: data.numberOfGuests,
                guestNames: data.guestNames,
            };

            (usersService.getUserById as jest.Mock).mockResolvedValue(user);
            (tripsService.getTripById as jest.Mock).mockResolvedValue(trip);
            (roomsService.getRoomForTrip as jest.Mock).mockResolvedValue(room);
            (flightsService.getAvailableSeats as jest.Mock)
                .mockResolvedValueOnce(flightToMoonSeats)
                .mockResolvedValueOnce(flightToEarthSeats);
            (
                bookingsService.createAndSaveBooking as jest.Mock
            ).mockResolvedValue(booking);

            const result = await createBooking(data);

            expect(result).toEqual({
                ...booking,
                user: {
                    id: booking.user.id,
                    firstName: booking.user.firstName,
                    lastName: booking.user.lastName,
                    email: booking.user.email,
                    role: booking.user.role,
                },
                room,
            });
        });

        it("should throw an InternalServerError if flight to Moon is not found", async () => {
            const badTrip = {
                ...trip,
                flightToMoon: {
                    ...trip.flightToMoon,
                    id: null,
                },
            };

            (usersService.getUserById as jest.Mock).mockResolvedValue(user);
            (tripsService.getTripById as jest.Mock).mockResolvedValue(badTrip);

            await expect(createBooking(data)).rejects.toThrow(
                InternalServerError,
            );
        });

        it("should throw an InternalServerError if flight to Earth is not found", async () => {
            const badTrip = {
                ...trip,
                flightToEarth: {
                    ...trip.flightToEarth,
                    id: null,
                },
            };

            (usersService.getUserById as jest.Mock).mockResolvedValue(user);
            (tripsService.getTripById as jest.Mock).mockResolvedValue(badTrip);

            await expect(createBooking(data)).rejects.toThrow(
                InternalServerError,
            );
        });

        it("should throw an InternalServerError if there is not enough capacity for the trip", async () => {
            const badTrip = {
                ...trip,
                occupancy: trip.capacity,
            };

            (usersService.getUserById as jest.Mock).mockResolvedValue(user);
            (tripsService.getTripById as jest.Mock).mockResolvedValue(badTrip);

            await expect(createBooking(data)).rejects.toThrow(
                InternalServerError,
            );
        });

        it("should return null if the booking could not be created", async () => {
            (usersService.getUserById as jest.Mock).mockResolvedValue(user);
            (tripsService.getTripById as jest.Mock).mockResolvedValue(trip);
            (roomsService.getRoomForTrip as jest.Mock).mockResolvedValue(room);
            (
                bookingsService.createAndSaveBooking as jest.Mock
            ).mockResolvedValue(null);

            const result = await createBooking(data);

            expect(result).toBeNull();
        });
    });
});
