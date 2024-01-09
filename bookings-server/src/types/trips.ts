import { Flight } from "../models/Flight";

export type SimpleTripResponse = {
    id: number;
    startDate: string;
    endDate: string;
    capacity: number;
    occupancy: number;
    status: string;
};

export type TripsResponse = SimpleTripResponse & {
    flightToMoon: Flight;
    flightToEarth: Flight;
};
