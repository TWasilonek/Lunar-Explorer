import { DBBookingMock } from "../../__mocks__/bookingMock";
import { flightMock } from "../../__mocks__/flightMock";
import { BadRequestError } from "../../errors/BadRequestError";
import {
    FlightOccupancyRecord,
    getFlightOccupancyRepository,
} from "../../repositories/flightOccupancyRepository";
import { getSeatsInShip } from "../spaceships/spaceships.service";
import { getAvailableSeats, getSeatsByBooking } from "./flights.service";

jest.mock("../../repositories/flightOccupancyRepository");
jest.mock("../spaceships/spaceships.service");

const flight = { ...flightMock };
const numberOfGuests = 2;
let allSeats = ["1", "2", "3", "4"];
const takenSeats: FlightOccupancyRecord[] = [
    {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        flight,
        // @ts-ignore we don't care abut the whole booking object
        booking: { ...DBBookingMock },
        seatNumber: "1",
    },
    {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        flight,
        // @ts-ignore we don't care abut the whole booking object
        booking: { ...DBBookingMock },
        seatNumber: "2",
    },
];

describe("Flights service", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAvailableSeats", () => {
        it("should return the first available seats for a flight for a specific number of guests", async () => {
            (getSeatsInShip as jest.Mock).mockReturnValue(allSeats);
            (getFlightOccupancyRepository as jest.Mock).mockReturnValue({
                find: jest.fn().mockResolvedValue(takenSeats),
            });

            const result = await getAvailableSeats(flight, numberOfGuests);

            expect(result).toEqual(["3", "4"]);
        });

        test("should throw an error if there are not enough seats available", async () => {
            allSeats = ["1", "2"];
            (getSeatsInShip as jest.Mock).mockReturnValue(allSeats);
            (getFlightOccupancyRepository as jest.Mock).mockReturnValue({
                find: jest.fn().mockResolvedValue(takenSeats),
            });

            await expect(
                getAvailableSeats(flight, numberOfGuests),
            ).rejects.toThrow(BadRequestError);
        });
    });

    describe("getSeatsByBooking", () => {
        it("should return the seat numbers for a specific booking", async () => {
            const booking = { ...DBBookingMock };
            const expectedSeats = ["1", "2"];

            (getFlightOccupancyRepository as jest.Mock).mockReturnValue({
                find: jest.fn().mockResolvedValue(takenSeats),
            });

            const result = await getSeatsByBooking(booking, flight);

            expect(result).toEqual(expectedSeats);
        });
    });
});
