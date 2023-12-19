import { appDataSource } from "../db/app-data-source";
import { FlightOccupancy } from "../models/FlightOccupancy";

export const flightOccupancyRepository =
    appDataSource.getRepository(FlightOccupancy);
