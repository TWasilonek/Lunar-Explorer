import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";
import { Manufacturer } from "./Manufacturer";

@Entity({ name: "spaceships" })
export class Spaceship extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {
        length: 100,
        nullable: false,
    })
    model: string;

    @Column("varchar", {
        length: 100,
    })
    name: string;

    @Column("int", {
        nullable: false,
    })
    totalSeats: number;

    @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.id, {
        onDelete: "SET NULL",
    })
    manufacturer: Manufacturer;
}
