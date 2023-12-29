import { appDataSource } from "../db/app-data-source";
import { Room } from "../models/Room";

export const roomRepository = appDataSource.getRepository(Room).extend({
    findById(id: string) {
        return this.createQueryBuilder("rooms")
            .where("rooms.id = :id", { id: +id })
            .getOne();
    },
});
