import { User } from "../models/User";
import { appDataSource } from "../db/app-data-source";

export const userRepository = appDataSource.getRepository(User).extend({
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
