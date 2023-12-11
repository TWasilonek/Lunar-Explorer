import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";

@Entity({ name: "ports" })
export class Port extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {
        length: 100,
        nullable: false,
    })
    name: string;

    @Column("varchar", {
        length: 4,
        nullable: false,
    })
    code: string;

    @Column("varchar", {
        length: 50,
        nullable: false,
    })
    location: string;
}
