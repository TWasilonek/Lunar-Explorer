import { format } from "date-fns";
import { tripRepository } from "../../repositories/tripRepository";
import { NotFoundError } from "../../errors/NotFoundError";

export const getTripsForDateRange = async (startDate: Date, endDate: Date) => {
    console.log(
        "startDate",
        format(startDate, "dd MMM yyyy"),
        "endDate",
        format(endDate, "dd MMM yyyy"),
    );

    return tripRepository
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

export const getTripById = async (tripId: string) => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
        throw new NotFoundError("Trip not found");
    }

    return trip;
};
