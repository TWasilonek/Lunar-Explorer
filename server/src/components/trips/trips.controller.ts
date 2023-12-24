import { addQuarters, format } from "date-fns";
import { NotFoundError } from "../../errors/NotFoundError";
import { tripRepository } from "../../repositories/tripRepository";
import { getTripsForDateRange } from "./trips.service";

type GetTripsParams = {
    startDate: string;
    endDate: string;
};

export const getTrips = async (params: GetTripsParams) => {
    const startDate = params.startDate
        ? new Date(params.startDate as string)
        : new Date();
    const endDate = params.endDate
        ? new Date(params.endDate as string)
        : addQuarters(startDate, 2);

    return getTripsForDateRange(startDate, endDate);
};

export const getTripById = async (tripId: string) => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
        throw new NotFoundError("Trip not found");
    }

    return trip;
};
