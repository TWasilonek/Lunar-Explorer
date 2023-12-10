import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Auditable } from "./Auditable";
import { Spaceship } from "./Spaceship";
import { Port } from "./Ports";

@Entity({ name: "flights" })
export class Flight extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {
        length: 8,
        nullable: false,
    })
    flightNumber: string;

    @OneToOne(() => Spaceship)
    @JoinColumn()
    spaceship: Spaceship;

    @Column("timestamp with time zone", {
        nullable: false,
    })
    departureTime: string;

    @Column("timestamp with time zone", {
        nullable: false,
    })
    arrivalTime: string;

    @ManyToOne(() => Port)
    originPort: Port;

    @ManyToOne(() => Port)
    destinationPort: Port;

    @Column("varchar", {
        length: 20,
        nullable: false,
    })
    status: string;
}
