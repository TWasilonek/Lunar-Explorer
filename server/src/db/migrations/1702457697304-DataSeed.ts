import fs from "fs";
import path from "path";
import { MigrationInterface, QueryRunner } from "typeorm";

export class DataSeed1702457697304 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const seedQuery = fs.readFileSync(
            path.join(__dirname, "..", "seed_data.sql"),
            {
                encoding: "utf-8",
            },
        );

        await queryRunner.query(seedQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        TRUNCATE public.room_occupancies RESTART IDENTITY CASCADE;
        TRUNCATE public.flight_occupancies RESTART IDENTITY CASCADE; 
        TRUNCATE public.payments RESTART IDENTITY CASCADE;
        TRUNCATE public.bookings RESTART IDENTITY CASCADE;
        TRUNCATE public.trips RESTART IDENTITY CASCADE;
        TRUNCATE public.flights RESTART IDENTITY CASCADE;
        TRUNCATE public.spaceships RESTART IDENTITY CASCADE;
        TRUNCATE public.manufacturers RESTART IDENTITY CASCADE;
        TRUNCATE public.ports RESTART IDENTITY CASCADE;
        TRUNCATE public.rooms RESTART IDENTITY CASCADE;
        TRUNCATE public.users RESTART IDENTITY CASCADE;`);
    }
}
