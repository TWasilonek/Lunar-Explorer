import { addMonths } from "date-fns";
import { getTrips, getTripById, ReturnTripSimple } from "./trips.controller";
import * as tripsController from "./trips.controller";
import * as tripsService from "./trips.service";
import { tripMock } from "../../__mocks__/tripMock";

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
            (tripsService.getTripsForDateRange as jest.Mock).mockResolvedValue(
                expectedTrips,
            );

            const result = await getTrips({
                startDate: "2022-01-01",
                endDate: "2022-03-31",
            });

            expect(result).toEqual(expectedTrips);
            expect(tripsService.getTripsForDateRange).toHaveBeenCalledWith(
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
            const getTripsForDateRangeMock =
                tripsService.getTripsForDateRange as jest.Mock;

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

            (tripsService.getTripById as jest.Mock).mockResolvedValue(
                expectedTrip,
            );

            const result = await getTripById(tripId);

            expect(result).toEqual(expectedTrip);
            expect(tripsService.getTripById as jest.Mock).toHaveBeenCalledWith(
                tripId,
            );
        });
    });
});
