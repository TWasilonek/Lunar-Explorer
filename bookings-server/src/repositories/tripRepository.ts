import { DataSource, Repository } from "typeorm";
import { Trip } from "../models/Trip";

let repository: Repository<Trip> & {
    findById(id: string): Promise<Trip | null>;
};

export const getTripRepository = () => {
    return repository;
};

export const createTripRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(Trip).extend({
        findById(id: string) {
            return this.findOne({
                where: {
                    id: +id,
                },
                relations: {
                    flightToMoon: {
                        spaceship: true,
                    },
                    flightToEarth: {
                        spaceship: true,
                    },
                },
            });
        },
    });
};
