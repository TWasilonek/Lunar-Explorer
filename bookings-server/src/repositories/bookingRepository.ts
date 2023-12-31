import { appDataSource } from "../db/app-data-source";
import { Booking } from "../models/Booking";
import { User } from "../models/User";

export type BookingRecord = Omit<Booking, "logInsert">;

export const bookingRepository = appDataSource.getRepository(Booking).extend({
    findById(id: string) {
        return this.createQueryBuilder("bookings")
            .where("bookings.id = :id", { id: +id })
            .getOne();
    },
    findByBookingNumber(bookingNumber: string) {
        return this.findOne({
            where: {
                bookingNumber,
            },
            relations: {
                user: true,
                trip: {
                    flightToMoon: true,
                    flightToEarth: true,
                },
            },
        });
    },
    findByUser(user: User) {
        return this.createQueryBuilder("bookings")
            .where("bookings.userId = :userId", { userId: user.id })
            .leftJoinAndSelect("bookings.trip", "trip")
            .leftJoinAndSelect("trip.flightToMoon", "flightToMoon")
            .leftJoinAndSelect("trip.flightToEarth", "flightToEarth")
            .getMany();
    },
});
