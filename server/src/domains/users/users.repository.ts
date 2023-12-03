import bcrypt from "bcryptjs";
// import { GetCollectionParams } from "../types/custom";
import { User } from "../../models/User";
import { appDataSource } from "../../database/app-data-source";

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
