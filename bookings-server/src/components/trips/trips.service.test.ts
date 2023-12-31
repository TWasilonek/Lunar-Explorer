import { format } from "date-fns";
import { getTripsForDateRange, getTripById } from "./trips.service";
import { tripRepository } from "../../repositories/tripRepository";
import { NotFoundError } from "../../errors/NotFoundError";
import { DBTripMock, tripMock } from "../../__mocks__/tripMock";
import { ReturnTripSimple } from "./trips.controller";
import { Trip } from "../../models/Trip";

jest.mock("../../repositories/tripRepository", () => {
    return {
        tripRepository: {
            createQueryBuilder: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                getMany: jest.fn(),
            }),
            findById: jest.fn(),
        },
    };
});

describe("getTripsForDateRange", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return trips within the specified date range", async () => {
        const startDate = new Date("2022-01-01");
        const endDate = new Date("2022-01-31");

        const dbTrips: Trip[] = [
            { ...DBTripMock, id: 1 },
            { ...DBTripMock, id: 2 },
        ];

        const expectedTrips: ReturnTripSimple[] = [
            {
                id: dbTrips[0].id,
                startDate: dbTrips[0].startDate,
                endDate: dbTrips[0].endDate,
                capacity: dbTrips[0].capacity,
                occupancy: dbTrips[0].occupancy,
                status: dbTrips[0].status,
            },
            {
                id: dbTrips[1].id,
                startDate: dbTrips[1].startDate,
                endDate: dbTrips[1].endDate,
                capacity: dbTrips[1].capacity,
                occupancy: dbTrips[1].occupancy,
                status: dbTrips[1].status,
            },
        ];

        (
            tripRepository.createQueryBuilder().where as jest.Mock
        ).mockReturnThis();
        (
            tripRepository.createQueryBuilder().andWhere as jest.Mock
        ).mockReturnThis();
        (
            tripRepository.createQueryBuilder().orderBy as jest.Mock
        ).mockReturnThis();
        (
            tripRepository.createQueryBuilder().getMany as jest.Mock
        ).mockResolvedValue(expectedTrips);

        const trips = await getTripsForDateRange(startDate, endDate);

        expect(trips).toEqual(expectedTrips);
        expect(tripRepository.createQueryBuilder().where).toHaveBeenCalledWith(
            '"startDate" > :startDate',
            {
                startDate,
            },
        );
        expect(
            tripRepository.createQueryBuilder().andWhere,
        ).toHaveBeenCalledWith('"endDate" < :endDate', {
            endDate,
        });
        expect(
            tripRepository.createQueryBuilder().orderBy,
        ).toHaveBeenCalledWith('"startDate"', "ASC");
        expect(tripRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });
});

describe("getTripById", () => {
    it("should return the trip with the specified ID", async () => {
        const tripId = DBTripMock.id.toString();
        const expectedTrip = {
            ...DBTripMock,
        };

        (tripRepository.findById as jest.Mock).mockResolvedValue(expectedTrip);

        const trip = await getTripById(tripId);

        expect(trip).toEqual(expectedTrip);
        expect(tripRepository.findById).toHaveBeenCalledWith(tripId);
    });

    it("should throw NotFoundError if the trip is not found", async () => {
        const tripId = "123";

        (tripRepository.findById as jest.Mock).mockResolvedValue(null);

        await expect(getTripById(tripId)).rejects.toThrow(NotFoundError);
        expect(tripRepository.findById).toHaveBeenCalledWith(tripId);
    });
});
