import { Column } from "typeorm";

export class Auditable {
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
