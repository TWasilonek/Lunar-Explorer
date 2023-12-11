import {
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
export class FlightOccupancy extends Auditable {
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
