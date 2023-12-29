import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";

@Entity({ name: "manufacturers" })
export class Manufacturer extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {
        length: 100,
        nullable: false,
    })
    name: string;
}
