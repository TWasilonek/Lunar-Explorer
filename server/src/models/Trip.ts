import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Auditable } from "./Auditable";
import { Flight } from "./Flight";

@Entity({ name: "trips" })
export class Trip extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("timestamp with time zone", {
        nullable: false,
    })
    startDate: string;

    @Column("timestamp with time zone", {
        nullable: false,
    })
    endDate: string;

    @OneToOne(() => Flight)
    @JoinColumn()
    flightToMoon: Flight;

    @OneToOne(() => Flight)
    @JoinColumn()
    flightToEarth: Flight;

    @Column("int", {
        nullable: false,
    })
    capacity: number;

    @Column("int", {
        nullable: false,
    })
    occupancy: number;

    @Column("varchar", {
        length: 20,
        nullable: false,
    })
    status: string;
}
