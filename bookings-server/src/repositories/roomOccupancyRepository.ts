import { DataSource, Repository } from "typeorm";
import { RoomOccupancy } from "../models/RoomOccupancy";
import { BookingRecord } from "./bookingRepository";

export type RoomOccupancyRecord = Omit<RoomOccupancy, "logInsert">;

let repository: Repository<RoomOccupancy> & {
    findByBooking(booking: BookingRecord): Promise<RoomOccupancyRecord | null>;
};

export const getRoomOccupancyRepository = () => {
    return repository;
};

export const createRoomOccupancyRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(RoomOccupancy).extend({
        findByBooking(booking: BookingRecord) {
            return this.createQueryBuilder("room_occupancies")
                .where("room_occupancies.bookingId = :id", { id: booking.id })
                .leftJoinAndSelect("room_occupancies.room", "room")
                .getOne();
        },
    });
};
