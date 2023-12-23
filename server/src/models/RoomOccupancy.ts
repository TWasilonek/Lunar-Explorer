import {
    AfterInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Auditable } from "./Auditable";
import { Booking } from "./Booking";
import { Trip } from "./Trip";
import { Room } from "./Room";

@Entity({ name: "room_occupancies" })
export class RoomOccupancy extends Auditable {
    @AfterInsert()
    logInsert() {
        console.log("Inserted RoomOccupancy with id", this.id);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Room, { onDelete: "CASCADE" })
    @JoinColumn()
    room: Room;

    @ManyToOne(() => Booking, (booking) => booking.id, { onDelete: "CASCADE" })
    @JoinColumn()
    booking: Booking;

    @ManyToOne(() => Trip, (trip) => trip.id, { onDelete: "CASCADE" })
    trip: Trip;

    @Column("int", {
        nullable: false,
    })
    numberOfOccupants: number;
}
