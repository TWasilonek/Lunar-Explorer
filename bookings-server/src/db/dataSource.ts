// app-data-source.ts
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

let dataSource: DataSource;

export const getDataSource = () => {
    return dataSource;
};

export const createDataSource = async (config: PostgresConnectionOptions) => {
    dataSource = new DataSource(config);
    // dataSource.driver.schema

    try {
        await dataSource.initialize();
        console.log(`Database connected on port ${config.port}`);
    } catch (error) {
        console.error(error);
    }

    return dataSource;
};
