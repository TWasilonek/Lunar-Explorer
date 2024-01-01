import { DataSource, Repository } from "typeorm";
import { User } from "../models/User";

let repository: Repository<User> & {
    findById(userId: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
};

export const getUserRepository = () => {
    return repository;
};

export const createUserRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(User).extend({
        findById(userId: string) {
            return this.createQueryBuilder("users")
                .where("users.id = :userId", { userId })
                .getOne();
        },
        findByEmail(email: string) {
            return this.createQueryBuilder("users")
                .where("users.email = :email", { email })
                .getOne();
        },
    });
};
