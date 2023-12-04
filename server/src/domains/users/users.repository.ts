import { User } from "../../models/User";
import { appDataSource } from "../../database/app-data-source";

export const usersRepository = appDataSource.getRepository(User).extend({
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
