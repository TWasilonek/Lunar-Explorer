import { appDataSource } from "../database/app-data-source";
import { Trip } from "../models/Trip";

export const tripRepository = appDataSource.getRepository(Trip).extend({
    findById(id: string) {
        return this.createQueryBuilder("trips")
            .where("trips.id = :id", { id: +id })
            .getOne();
    },
});
