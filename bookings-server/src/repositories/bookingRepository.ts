import { DataSource, Repository } from "typeorm";
import { Booking } from "../models/Booking";
import { User } from "../models/User";

export type BookingRecord = Omit<Booking, "logInsert">;

let repository: Repository<Booking> & {
    findById(id: string): Promise<Booking | null>;
    findByBookingNumber(bookingNumber: string): Promise<Booking | null>;
    findByUser(user: User): Promise<Booking[]>;
};

export const getBookingRepository = () => {
    return repository;
};

export const createBookingRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(Booking).extend({
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
};
