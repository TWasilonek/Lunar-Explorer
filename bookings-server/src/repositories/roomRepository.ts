import { Room } from "../models/Room";

import { DataSource, Repository } from "typeorm";

let repository: Repository<Room> & {
    findById(id: string): Promise<Room | null>;
};

export const getRoomRepository = () => {
    return repository;
};

export const createRoomRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(Room).extend({
        findById(id: string) {
            return this.createQueryBuilder("rooms")
                .where("rooms.id = :id", { id: +id })
                .getOne();
        },
    });
};
