import { appDataSource } from "../db/app-data-source";
import { Flight } from "../models/Flight";

export const flightRepository = appDataSource.getRepository(Flight).extend({
    findById(id: number) {
        return this.createQueryBuilder("flights")
            .where("flights.id = :id", { id: +id })
            .getOne();
    },
});
