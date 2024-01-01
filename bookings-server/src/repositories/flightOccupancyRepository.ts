import { DataSource, Repository } from "typeorm";
import { FlightOccupancy } from "../models/FlightOccupancy";

let repository: Repository<FlightOccupancy>;

export const getFlightOccupancyRepository = () => {
    return repository;
};

export const createFlightOccupancyRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(FlightOccupancy);
};
