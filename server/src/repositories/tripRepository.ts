import { appDataSource } from "../db/app-data-source";
import { Trip } from "../models/Trip";

export const tripRepository = appDataSource.getRepository(Trip).extend({
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
