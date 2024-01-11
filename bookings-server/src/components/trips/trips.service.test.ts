import { getTripsForDateRange, getTripById } from "./trips.service";
import { NotFoundError } from "../../errors/NotFoundError";
import { DBTripMock } from "../../__mocks__/tripMock";
import { Trip } from "../../models/Trip";
import { SimpleTripResponse } from "../../types";

const mockTripRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
    }),
    findById: jest.fn(),
};
jest.mock("../../repositories/tripRepository", () => ({
    getTripRepository: jest.fn().mockImplementation(() => {
        return mockTripRepository;
    }),
}));

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

        const expectedTrips: SimpleTripResponse[] = [
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
            mockTripRepository.createQueryBuilder().where as jest.Mock
        ).mockReturnThis();
        (
            mockTripRepository.createQueryBuilder().andWhere as jest.Mock
        ).mockReturnThis();
        (
            mockTripRepository.createQueryBuilder().orderBy as jest.Mock
        ).mockReturnThis();
        (
            mockTripRepository.createQueryBuilder().getMany as jest.Mock
        ).mockResolvedValue(expectedTrips);

        const trips = await getTripsForDateRange(startDate, endDate);

        expect(trips).toEqual(expectedTrips);
        expect(
            mockTripRepository.createQueryBuilder().where,
        ).toHaveBeenCalledWith('"startDate" > :startDate', {
            startDate,
        });
        expect(
            mockTripRepository.createQueryBuilder().andWhere,
        ).toHaveBeenCalledWith('"endDate" < :endDate', {
            endDate,
        });
        expect(
            mockTripRepository.createQueryBuilder().orderBy,
        ).toHaveBeenCalledWith('"startDate"', "ASC");
        expect(
            mockTripRepository.createQueryBuilder().getMany,
        ).toHaveBeenCalled();
    });
});

describe("getTripById", () => {
    it("should return the trip with the specified ID", async () => {
        const tripId = DBTripMock.id;
        const expectedTrip = {
            ...DBTripMock,
        };

        (mockTripRepository.findById as jest.Mock).mockResolvedValue(
            expectedTrip,
        );

        const trip = await getTripById(DBTripMock.id);

        expect(trip).toEqual(expectedTrip);
        expect(mockTripRepository.findById).toHaveBeenCalledWith(tripId);
    });

    it("should throw NotFoundError if the trip is not found", async () => {
        const tripId = 123;

        (mockTripRepository.findById as jest.Mock).mockResolvedValue(null);

        await expect(getTripById(tripId)).rejects.toThrow(NotFoundError);
        expect(mockTripRepository.findById).toHaveBeenCalledWith(tripId);
    });
});
