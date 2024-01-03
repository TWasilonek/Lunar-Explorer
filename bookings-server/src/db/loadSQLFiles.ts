import fs from "fs";
import path from "path";

export const getSeedSchemaSQL = () => {
    return fs.readFileSync(path.join(__dirname, "sql", "seed_schema.sql"), {
        encoding: "utf-8",
    });
};

export const getSeedDataSQL = () => {
    return fs.readFileSync(path.join(__dirname, "sql", "seed_data.sql"), {
        encoding: "utf-8",
    });
};

export const getCleanTablesSQL = () => {
    return fs.readFileSync(path.join(__dirname, "sql", "clean_tables.sql"), {
        encoding: "utf-8",
    });
};

export const getCleanDBSQL = () => {
    return fs.readFileSync(path.join(__dirname, "sql", "clean_db.sql"), {
        encoding: "utf-8",
    });
};
