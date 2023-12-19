import { appDataSource } from "../db/app-data-source";
import { RoomOccupancy } from "../models/RoomOccupancy";

export const roomOccupancyRepository =
    appDataSource.getRepository(RoomOccupancy);
