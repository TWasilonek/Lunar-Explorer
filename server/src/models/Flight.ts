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
import { Port } from "./Port";

@Entity({ name: "flights" })
export class Flight extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {
        length: 8,
        nullable: false,
    })
    flightNumber: string;

    @ManyToOne(() => Spaceship, (spaceship) => spaceship.id)
    spaceship: Spaceship;

    @Column("timestamp with time zone", {
        nullable: false,
    })
    departureTime: string;

    @Column("timestamp with time zone", {
        nullable: false,
    })
    arrivalTime: string;

    @ManyToOne(() => Port, (port) => port.id)
    originPort: Port;

    @ManyToOne(() => Port, (port) => port.id)
    destinationPort: Port;

    @Column("varchar", {
        length: 20,
        nullable: false,
    })
    status: string;
}
