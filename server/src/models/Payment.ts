import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";
import { Booking } from "./Booking";

@Entity({ name: "payments" })
export class Payment extends Auditable {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("decimal", {
        precision: 12,
        scale: 2,
        nullable: false,
    })
    amount: number;

    @Column("timestamp with time zone", {
        default: () => `now()`,
        nullable: false,
    })
    paymentDate: string;

    @Column("varchar", {
        length: 50,
        nullable: false,
    })
    paymentMethod: string;

    @ManyToOne(() => Booking, (booking) => booking.id)
    bookingId: string;
}
