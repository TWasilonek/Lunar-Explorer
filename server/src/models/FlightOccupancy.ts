import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Auditable } from "./Auditable";
import { Booking } from "./Booking";
import { Flight } from "./Flight";

@Entity({ name: "flight_occupancies" })
export class FlightOccupancy extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Booking, (booking) => booking.id, { onDelete: "CASCADE" })
    booking: Booking;

    @ManyToOne(() => Flight, (flight) => flight.id, { onDelete: "CASCADE" })
    flight: Flight;

    @Column("varchar", {
        length: 3,
        nullable: false,
    })
    seatNumber: number;
}
