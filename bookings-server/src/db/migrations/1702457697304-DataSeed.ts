import { MigrationInterface, QueryRunner } from "typeorm";
import { getCleanTablesSQL, getSeedDataSQL } from "../loadSQLFiles";

export class DataSeed1702457697304 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const seedQuery = getSeedDataSQL();
        await queryRunner.query(seedQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const cleanTablesQuery = getCleanTablesSQL();
        await queryRunner.query(cleanTablesQuery);
    }
}
