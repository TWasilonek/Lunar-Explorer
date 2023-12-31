import { addQuarters, differenceInMonths, isToday } from "date-fns";
import { NotFoundError } from "../../errors/NotFoundError";
import { tripRepository } from "../../repositories/tripRepository";
import { getTrips, getTripById } from "./trips.controller";
import { getTripsForDateRange } from "./trips.service";

jest.mock("../../repositories/tripRepository");
jest.mock("./trips.service");

describe("Trips Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getTrips", () => {
        it("should return trips for the given date range", async () => {
            const startDate = new Date("2022-01-01");
            const endDate = new Date("2022-03-31");
            const expectedTrips = ["trip1", "trip2"];

            (getTripsForDateRange as jest.Mock).mockResolvedValue(
                expectedTrips,
            );

            const result = await getTrips({
                startDate: "2022-01-01",
                endDate: "2022-03-31",
            });

            expect(result).toEqual(expectedTrips);
            expect(getTripsForDateRange).toHaveBeenCalledWith(
                startDate,
                endDate,
            );
        });

        it("should return trips for the current date range if no params are provided", async () => {
            const currentDate = new Date();
            const expectedTrips = ["trip1", "trip2"];
            const getTripsForDateRangeMock = getTripsForDateRange as jest.Mock;

            getTripsForDateRangeMock.mockResolvedValue(expectedTrips);

            const result = await getTrips({ startDate: "", endDate: "" });

            expect(result).toEqual(expectedTrips);
            expect(getTripsForDateRangeMock).toHaveBeenCalledWith(
                expect.any(Date),
                expect.any(Date),
            );
            // Check if currentDate is today
            expect(isToday(getTripsForDateRangeMock.mock.calls[0][0])).toBe(
                true,
            );

            // Check if endDate is exactly 6 months ahead
            const monthsDifference = differenceInMonths(
                getTripsForDateRangeMock.mock.calls[0][1],
                currentDate,
            );
            expect(monthsDifference).toBe(6);
        });
    });

    describe("getTripById", () => {
        it("should return the trip with the given ID", async () => {
            const tripId = "123";
            const expectedTrip = { id: tripId, name: "Trip 1" };

            (tripRepository.findById as jest.Mock).mockResolvedValue(
                expectedTrip,
            );

            const result = await getTripById(tripId);

            expect(result).toEqual(expectedTrip);
            expect(tripRepository.findById).toHaveBeenCalledWith(tripId);
        });

        it("should throw NotFoundError if the trip with the given ID is not found", async () => {
            const tripId = "123";

            (tripRepository.findById as jest.Mock).mockResolvedValue(null);

            await expect(getTripById(tripId)).rejects.toThrow(NotFoundError);
            expect(tripRepository.findById).toHaveBeenCalledWith(tripId);
        });
    });
});
