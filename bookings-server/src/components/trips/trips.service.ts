import { format } from "date-fns";
import { getTripRepository } from "../../repositories/tripRepository";
import { NotFoundError } from "../../errors/NotFoundError";
import { Trip } from "../../models/Trip";

export const getTripsForDateRange = async (
    startDate: Date,
    endDate: Date,
): Promise<Trip[]> => {
    console.log(
        "startDate",
        format(startDate, "dd MMM yyyy"),
        "endDate",
        format(endDate, "dd MMM yyyy"),
    );

    return getTripRepository()
        .createQueryBuilder()
        .where('"startDate" > :startDate', {
            startDate,
        })
        .andWhere('"endDate" < :endDate', {
            endDate,
        })
        .orderBy('"startDate"', "ASC")
        .getMany();
};

export const getTripById = async (tripId: number): Promise<Trip> => {
    const trip = await getTripRepository().findById(tripId);
    if (!trip) {
        throw new NotFoundError("Trip not found");
    }

    return trip;
};
