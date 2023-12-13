import fs from "fs";
import path from "path";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSeed1702457687862 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const seedQuery = fs.readFileSync(
            path.join(__dirname, "..", "seed_schema.sql"),
            {
                encoding: "utf-8",
            },
        );

        // TODO: Postrgresql disallows that - cannot drop database in a transactioon block
        // await queryRunner.dropDatabase("lunar_explorer_test", true);
        // await queryRunner.createDatabase("lunar_explorer_test", true);
        await queryRunner.query(seedQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE IF EXISTS public.bookings CASCADE;
        DROP TABLE IF EXISTS public.flight_occupancies CASCADE;
        DROP TABLE IF EXISTS public.flights CASCADE;
        DROP TABLE IF EXISTS public.manufacturers CASCADE;
        DROP TABLE IF EXISTS public.payments CASCADE;
        DROP TABLE IF EXISTS public.ports CASCADE;
        DROP TABLE IF EXISTS public.room_occupancies CASCADE;
        DROP TABLE IF EXISTS public.rooms CASCADE;
        DROP TABLE IF EXISTS public.spaceships CASCADE;
        DROP TABLE IF EXISTS public.trips CASCADE;
        DROP TABLE IF EXISTS public.users CASCADE;`);
    }
}
