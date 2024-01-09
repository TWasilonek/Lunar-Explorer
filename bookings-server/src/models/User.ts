import { IsNotEmpty, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Auditable } from "./Auditable";
import { UserRole } from "../types";

@Entity({ name: "users" })
export class User extends Auditable {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {
        length: 50,
        nullable: false,
    })
    @Length(2, 50)
    firstName: string;

    @Column("varchar", {
        length: 50,
        nullable: false,
    })
    @Length(2, 50)
    lastName: string;

    @Column("varchar", {
        length: 255,
        unique: true,
        nullable: false,
    })
    @IsNotEmpty()
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

    @Column("varchar", {
        length: 255,
        nullable: true,
        unique: true,
    })
    refreshToken: string | null;
}
