import { Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
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
}
