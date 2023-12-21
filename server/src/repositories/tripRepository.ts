import { appDataSource } from "../db/app-data-source";
import { Trip } from "../models/Trip";

export const tripRepository = appDataSource.getRepository(Trip);
