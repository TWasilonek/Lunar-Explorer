import { DataSource, Repository } from "typeorm";
import { Flight } from "../models/Flight";

let repository: Repository<Flight> & {
    findById(id: number): Promise<Flight | null>;
};

export const getFlightRepository = () => {
    return repository;
};

export const createFlightRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(Flight).extend({
        findById(id: number) {
            return this.createQueryBuilder("flights")
                .where("flights.id = :id", { id: +id })
                .getOne();
        },
    });
};
