import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";
import { Spaceship } from "./Spaceship";

@Entity({ name: "manufacturers" })
export class Manufacturer extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {
        length: 100,
        nullable: false,
    })
    name: string;

    @OneToMany(() => Spaceship, (spaceship) => spaceship.manufacturer, {
        onDelete: "SET NULL",
    })
    spaceships: Spaceship[];
}
