import {
    AfterInsert,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Auditable } from "./Auditable";
import { User } from "./User";
import { Trip } from "./Trip";

@Entity({ name: "bookings" })
export class Booking extends Auditable {
    @AfterInsert()
    logInsert() {
        console.log("Inserted Booking with id", this.id);
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {
        length: 10,
        nullable: false,
    })
    bookingNumber: string;

    @Column("varchar", {
        length: 20,
        nullable: false,
        default: "pending_payment",
    })
    status: string;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: "SET NULL",
    })
    user: User;

    @ManyToOne(() => Trip, (trip) => trip.id)
    trip: Trip;

    @Column("int", {
        nullable: false,
    })
    numberOfGuests: number;

    @Column("text", {
        array: true,
    })
    guestNames: string[];
}
