import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";

export type Photo = {
    url: string;
    description: string;
};

@Entity({ name: "rooms" })
export class Room extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {
        length: 3,
        nullable: false,
    })
    roomNumber: string;

    @Column("int", {
        nullable: false,
    })
    capacity: number;

    @Column("varchar", {
        length: 255,
    })
    mainPhotoUrl: string;

    @Column({ type: "jsonb" })
    photos: Photo[];
}
