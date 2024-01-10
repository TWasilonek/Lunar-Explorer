import { DataSource, Repository } from "typeorm";
import { Trip } from "../models/Trip";

let repository: Repository<Trip> & {
    findById(id: number): Promise<Trip | null>;
};

export const getTripRepository = () => {
    return repository;
};

export const createTripRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(Trip).extend({
        findById(id: number) {
            return this.findOne({
                where: {
                    id,
                },
                relations: {
                    flightToMoon: {
                        spaceship: {
                            manufacturer: true,
                        },
                        originPort: true,
                        destinationPort: true,
                    },
                    flightToEarth: {
                        spaceship: {
                            manufacturer: true,
                        },
                        originPort: true,
                        destinationPort: true,
                    },
                },
            });
        },
    });
};
