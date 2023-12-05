import { Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";
import { UserRole } from "../constants";

@Entity({ name: "users" })
export class User extends Auditable {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {
        length: 50,
        nullable: false,
    })
    firstName: string;

    @Column("varchar", {
        length: 50,
        nullable: false,
    })
    lastName: string;

    @Column("varchar", {
        length: 255,
        unique: true,
        nullable: false,
    })
    email: string;

    @Column("varchar", {
        length: 100,
        nullable: false,
    })
    @Length(8, 100)
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;
}
