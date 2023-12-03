import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const dbConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: process.env.PG_HOST,
    port: process.env.PG_PORT as unknown as number,
    username: process.env.PG_ACCOUNT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: process.env.PG_SYNCHRONIZE as unknown as boolean,
    logging: process.env.PG_LOGGING as unknown as boolean,
    entities: [process.env.PG_ENTITIES as unknown as string],
};

export const appDataSource = new DataSource(dbConfig);
