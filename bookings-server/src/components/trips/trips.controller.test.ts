import { addMonths, differenceInMonths, isToday, startOfDay } from "date-fns";
import { NotFoundError } from "../../errors/NotFoundError";
import { tripRepository } from "../../repositories/tripRepository";
import {
    getTrips,
    getTripById,
    ReturnTripSimple,
    getDefaultEndDate,
} from "./trips.controller";
import * as tripsController from "./trips.controller";
import { getTripsForDateRange } from "./trips.service";
import { tripMock } from "../../__mocks__/tripMock";

jest.mock("../../repositories/tripRepository", () => ({
    tripRepository: {
        findById: jest.fn(),
    },
}));
jest.mock("./trips.service");

describe("Trips Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getTrips", () => {
        it("should return trips for the given date range", async () => {
            const startDate = new Date("2022-01-01");
            const endDate = new Date("2022-03-31");
            const expectedTrips: ReturnTripSimple[] = [
                {
                    id: 1,
                    startDate: "2022-01-01",
                    endDate: "2022-03-31",
                    capacity: 15,
                    occupancy: 2,
                    status: "scheduled",
                },
                {
                    id: 2,
                    startDate: "2022-01-01",
                    endDate: "2022-03-31",
                    capacity: 15,
                    occupancy: 2,
                    status: "scheduled",
                },
            ];
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
            const endDate = addMonths(currentDate, 2);
            const expectedTrips: ReturnTripSimple[] = [
                {
                    id: 1,
                    startDate: "2022-01-01",
                    endDate: "2022-03-31",
                    capacity: 15,
                    occupancy: 2,
                    status: "scheduled",
                },
                {
                    id: 2,
                    startDate: "2022-01-01",
                    endDate: "2022-03-31",
                    capacity: 15,
                    occupancy: 2,
                    status: "scheduled",
                },
            ];
            const getTripsForDateRangeMock = getTripsForDateRange as jest.Mock;

            getTripsForDateRangeMock.mockResolvedValue(expectedTrips);
            jest.spyOn(tripsController, "getDefaultStartDate").mockReturnValue(
                currentDate,
            );
            jest.spyOn(tripsController, "getDefaultEndDate").mockReturnValue(
                endDate,
            );

            const result = await getTrips({ startDate: "", endDate: "" });

            expect(result).toEqual(expectedTrips);
            expect(getTripsForDateRangeMock).toHaveBeenCalledWith(
                currentDate,
                endDate,
            );
        });
    });

    describe("getTripById", () => {
        it("should return the trip with the given ID", async () => {
            const tripId = tripMock.id.toString();
            const expectedTrip = {
                id: tripMock.id,
                startDate: tripMock.startDate,
                endDate: tripMock.endDate,
                capacity: tripMock.capacity,
                occupancy: tripMock.occupancy,
                status: tripMock.status,
                flightToMoon: tripMock.flightToMoon,
                flightToEarth: tripMock.flightToEarth,
            };

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
