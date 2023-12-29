import { appDataSource } from "../db/app-data-source";
import { Booking } from "../models/Booking";
import { RoomOccupancy } from "../models/RoomOccupancy";

export const roomOccupancyRepository = appDataSource
    .getRepository(RoomOccupancy)
    .extend({
        findByBooking(booking: Booking) {
            return this.createQueryBuilder("room_occupancies")
                .where("room_occupancies.bookingId = :id", { id: booking.id })
                .leftJoinAndSelect("room_occupancies.room", "room")
                .getOne();
        },
    });
