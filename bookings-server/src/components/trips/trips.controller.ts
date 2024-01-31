import { addQuarters } from "date-fns";
import * as tripsService from "./trips.service";
import { TripsResponse, SimpleTripResponse } from "../../types";

export const getDefaultStartDate = (): Date => new Date();
export const getDefaultEndDate = (startDate: Date): Date =>
    addQuarters(startDate, 2);

type GetTripsParams = {
    startDate: string;
    endDate: string;
};

export const getTrips = async (
    params: GetTripsParams,
): Promise<SimpleTripResponse[]> => {
    const startDate = params.startDate
        ? new Date(params.startDate)
        : getDefaultStartDate();
    const endDate = params.endDate
        ? new Date(params.endDate)
        : getDefaultEndDate(startDate);

    const trips = await tripsService.getTripsForDateRange(startDate, endDate);
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

export const getTripById = async (tripId: number): Promise<TripsResponse> => {
    const trip = await tripsService.getTripById(tripId);

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
