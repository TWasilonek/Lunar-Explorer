import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createApp } from "../../app";
import { DataSource } from "typeorm";
import { randomBytes } from "crypto";
import { Pool } from "pg";
import format from "pg-format";
import { getDataSource } from "../../db/dataSource";
import {
    getCleanDBSQL,
    getCleanTablesSQL,
    getSeedDataSQL,
    getSeedSchemaSQL,
} from "../../db/loadSQLFiles";
import { dbTestConfig } from "../../db/testConfig";

export class TestDBContext {
    private roleName: string;

    private _app: Express.Application;
    get app() {
        return this._app;
    }

    private _dataSource: DataSource;
    get dataSource() {
        return this._dataSource;
    }

    public async createApp() {
        this.roleName = this.createRoleName();
        await this.createSchemaWithRole(this.roleName);

        // connect to the schema created for this app instance
        const dbConfigWithSchema: PostgresConnectionOptions = {
            ...dbTestConfig,
            schema: this.roleName,
            username: this.roleName,
            password: this.roleName,
        };

        this._app = await createApp(dbConfigWithSchema);
        this._dataSource = getDataSource();
    }

    public async seedSchema() {
        const seedSchemaSQL = getSeedSchemaSQL(this.roleName);
        await this._dataSource.query(seedSchemaSQL);
    }

    public async seedData() {
        const seedDataSQL = getSeedDataSQL();
        await this._dataSource.query(seedDataSQL);
    }

    public async destroy() {
        const cleanDbQuery = getCleanDBSQL(this.roleName);
        const cleanTablesQuery = getCleanTablesSQL(this.roleName);
        await this._dataSource.query(cleanTablesQuery);
        await this._dataSource.query(cleanDbQuery);
        await this._dataSource.destroy();
        await this.dropSchemaWithRole(this.roleName);
    }

    private async createSchemaWithRole(roleName: string) {
        const pool = new Pool({
            user: dbTestConfig.username,
            password: dbTestConfig.password,
            host: dbTestConfig.host,
            port: dbTestConfig.port,
            database: dbTestConfig.database,
        });

        const client = await pool.connect();
        // create a new role
        await client.query(
            format(
                "CREATE ROLE %I WITH LOGIN PASSWORD %L;",
                roleName,
                roleName,
            ),
        );

        // create a schema with the same name
        await client.query(
            format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName),
        );

        // Disconnect entirely from PG
        await client.release(true);
        await pool.end();

        this.roleName = roleName;
    }

    private async dropSchemaWithRole(roleName: string) {
        const pool = new Pool({
            user: dbTestConfig.username,
            password: dbTestConfig.password,
            host: dbTestConfig.host,
            port: dbTestConfig.port,
            database: dbTestConfig.database,
        });

        const client = await pool.connect();

        // drop the schema
        await client.query(format("DROP SCHEMA %I CASCADE;", roleName));

        // drop the role
        await client.query(format("DROP ROLE %I;", roleName));

        // Disconnect entirely from PG
        await client.release(true);
        await pool.end();
    }

    private createRoleName() {
        return `test_${randomBytes(8).toString("hex")}`;
    }
}
