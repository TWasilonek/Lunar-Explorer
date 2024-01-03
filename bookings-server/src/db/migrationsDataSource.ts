import "dotenv/config";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const dbConfig: PostgresConnectionOptions = {
    type: "postgres",
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: false, // the migrations will take care of this
    logging: false,
    entities: [process.env.PG_ENTITIES as unknown as string],
    migrations: [process.env.PG_MIGRATIONS as unknown as string],
};

export const appDataSource = new DataSource(dbConfig);
