import "dotenv/config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { isProduction } from "../utils/env";

export const dbConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: process.env.PG_HOST,
    port: process.env.PG_PORT as unknown as number,
    username: process.env.PG_ACCOUNT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: false, // the migrations will take care of this
    logging: false,
    entities: [process.env.PG_ENTITIES as unknown as string],
    migrations: [process.env.PG_MIGRATIONS as unknown as string],
    ssl: isProduction()
        ? {
              // TODO: Handle it better on the cloud and create a self-signed certificate
              rejectUnauthorized: false,
          }
        : false,
};
