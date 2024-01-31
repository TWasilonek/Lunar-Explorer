import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createBookingRepository } from "../repositories/bookingRepository";
import { createFlightOccupancyRepository } from "../repositories/flightOccupancyRepository";
import { createFlightRepository } from "../repositories/flightRepository";
import { createRoomOccupancyRepository } from "../repositories/roomOccupancyRepository";
import { createRoomRepository } from "../repositories/roomRepository";
import { createTripRepository } from "../repositories/tripRepository";
import { createUserRepository } from "../repositories/userRepository";

let dataSource: DataSource;

export const getDataSource = () => {
    return dataSource;
};

export const createDataSource = async (config: PostgresConnectionOptions) => {
    dataSource = new DataSource(config);

    try {
        await dataSource.initialize();
        console.log(`Database connected on port ${config.port}`);
        initializeRepositories(dataSource);
    } catch (error) {
        console.error(error);
    }

    return dataSource;
};

export const initializeRepositories = (dataSource: DataSource) => {
    createBookingRepository(dataSource);
    createFlightOccupancyRepository(dataSource);
    createFlightRepository(dataSource);
    createRoomOccupancyRepository(dataSource);
    createRoomRepository(dataSource);
    createTripRepository(dataSource);
    createUserRepository(dataSource);
};
