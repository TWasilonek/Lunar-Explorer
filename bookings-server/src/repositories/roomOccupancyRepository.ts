import { DataSource, Repository } from "typeorm";
import { Booking } from "../models/Booking";
import { RoomOccupancy } from "../models/RoomOccupancy";

let repository: Repository<RoomOccupancy> & {
    findByBooking(booking: Booking): Promise<RoomOccupancy | null>;
};

export const getRoomOccupancyRepository = () => {
    return repository;
};

export const createRoomOccupancyRepository = (dataSource: DataSource) => {
    repository = dataSource.getRepository(RoomOccupancy).extend({
        findByBooking(booking: Booking) {
            return this.createQueryBuilder("room_occupancies")
                .where("room_occupancies.bookingId = :id", { id: booking.id })
                .leftJoinAndSelect("room_occupancies.room", "room")
                .getOne();
        },
    });
};
