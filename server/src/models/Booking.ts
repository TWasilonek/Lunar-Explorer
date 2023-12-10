import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";
import { User } from "./User";
import { Trip } from "./Trip";

@Entity({ name: "bookings" })
export class Booking extends Auditable {
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
    })
    status: string;

    @ManyToOne(() => User, (user) => user.id)
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
