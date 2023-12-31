import { addQuarters } from "date-fns";
import { NotFoundError } from "../../errors/NotFoundError";
import { tripRepository } from "../../repositories/tripRepository";
import { getTripsForDateRange } from "./trips.service";
import { Flight } from "../../models/Flight";

export type ReturnTripSimple = {
    id: number;
    startDate: string;
    endDate: string;
    capacity: number;
    occupancy: number;
    status: string;
};

export type ReturnTrip = ReturnTripSimple & {
    flightToMoon: Flight;
    flightToEarth: Flight;
};

export const getDefaultStartDate = (): Date => new Date();
export const getDefaultEndDate = (startDate: Date): Date =>
    addQuarters(startDate, 2);

type GetTripsParams = {
    startDate: string;
    endDate: string;
};

export const getTrips = async (
    params: GetTripsParams,
): Promise<ReturnTripSimple[]> => {
    const startDate = params.startDate
        ? new Date(params.startDate as string)
        : getDefaultStartDate();
    const endDate = params.endDate
        ? new Date(params.endDate as string)
        : getDefaultEndDate(startDate);

    const trips = await getTripsForDateRange(startDate, endDate);
    return trips.map((trip) => {
        return {
            id: trip.id,
            startDate: trip.startDate,
            endDate: trip.endDate,
            capacity: trip.capacity,
            occupancy: trip.occupancy,
            status: trip.status,
        };
    });
};

export const getTripById = async (tripId: string): Promise<ReturnTrip> => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
        throw new NotFoundError("Trip not found");
    }

    return {
        id: trip.id,
        startDate: trip.startDate,
        endDate: trip.endDate,
        capacity: trip.capacity,
        occupancy: trip.occupancy,
        status: trip.status,
        flightToMoon: trip.flightToMoon,
        flightToEarth: trip.flightToEarth,
    };
};
