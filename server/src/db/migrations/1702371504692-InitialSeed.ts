import fs from "fs";
import path from "path";
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSeed1702371504692 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const seedQuery = fs.readFileSync(path.join("..", "seed.sql"), {
            encoding: "utf-8",
        });

        await queryRunner.query(seedQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // drop everything from payments, bookings, flight_occupancies, room_occupancies, trips, flights, rooms, users, ports, spaceships, manufacturers
    }
}
