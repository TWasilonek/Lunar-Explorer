import "dotenv/config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const dbTestConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: process.env.PG_TEST_HOST,
    port: process.env.PG_PORT as unknown as number,
    username: process.env.PG_ACCOUNT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_TEST_DATABASE,
    synchronize: false, // the migrations will take care of this
    logging: false,
    entities: [process.env.PG_ENTITIES as unknown as string],
};
