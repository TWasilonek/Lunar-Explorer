import { appDataSource } from "../db/app-data-source";
import { Booking } from "../models/Booking";

export const bookingRepository = appDataSource.getRepository(Booking).extend({
    findById(id: string) {
        return this.createQueryBuilder("bookings")
            .where("bookings.id = :id", { id: +id })
            .getOne();
    },
});
