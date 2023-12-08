import { Column, BaseEntity } from "typeorm";

export class Auditable extends BaseEntity {
    @Column("timestamp with time zone", {
        default: () => `now()`,
        nullable: false,
    })
    createdAt: Date;

    @Column("timestamp with time zone", {
        default: () => `now()`,
        nullable: false,
    })
    updatedAt: Date;
}
