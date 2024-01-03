import { MigrationInterface, QueryRunner } from "typeorm";
import { getCleanDBSQL, getSeedSchemaSQL } from "../loadSQLFiles";

export class SchemaSeed1702457687862 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const seedQuery = getSeedSchemaSQL();
        await queryRunner.query(seedQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const cleanDbQuery = getCleanDBSQL();
        await queryRunner.query(cleanDbQuery);
    }
}
