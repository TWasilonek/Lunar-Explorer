import { NotFoundError } from "../../errors/NotFoundError";
import { tripRepository } from "../../repositories/tripRepository";

type GetTripsParams = {
    startDate?: Date;
    endDate?: Date;
};

export const getTrips = async (params?: GetTripsParams) => {
    // set default dates
    const startDate = params?.startDate ?? new Date(0);
    const endDate = params?.endDate ?? new Date();
    // add pagination by dates
    return tripRepository.find();
};

export const getTripById = async (tripId: string) => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
        throw new NotFoundError("Trip not found");
    }

    return trip;
};
