import supertest from "supertest";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createApp } from "../../app";
import { DataSource } from "typeorm";
import { getDataSource } from "../../db/dataSource";
import {
    getCleanDBSQL,
    getCleanTablesSQL,
    getSeedDataSQL,
    getSeedSchemaSQL,
} from "../../db/loadSQLFiles";

export class TestDBContext {
    // private _request: supertest.SuperTest<supertest.Test>;
    // get request() {
    //     return this._request;
    // }

    private _app: Express.Application;
    get app() {
        return this._app;
    }

    private _dataSource: DataSource;
    get dataSource() {
        return this._dataSource;
    }

    // public async createRequest() {
    //     this._request = supertest(this._app);
    // }

    public async createApp() {
        // Start the test database
        const dbConfig: PostgresConnectionOptions = {
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "tomaszw",
            password: "",
            database: "lunar_explorer_test",
            synchronize: false, // the migrations will take care of this
            logging: false,
            entities: [process.env.PG_ENTITIES as unknown as string],
            // migrations: [process.env.PG_MIGRATIONS as unknown as string],
        };
        this._app = await createApp(dbConfig);
        this._dataSource = getDataSource();
    }

    public async seedSchema() {
        const seedSchemaSQL = getSeedSchemaSQL();
        await this._dataSource.query(seedSchemaSQL);
    }

    public async seedData() {
        const seedDataSQL = getSeedDataSQL();
        await this._dataSource.query(seedDataSQL);
    }

    public async destroy() {
        const cleanDbQuery = getCleanDBSQL();
        const cleanTablesQuery = getCleanTablesSQL();
        await this._dataSource.query(cleanTablesQuery);
        await this._dataSource.query(cleanDbQuery);
        await this._dataSource.destroy();
    }
}
