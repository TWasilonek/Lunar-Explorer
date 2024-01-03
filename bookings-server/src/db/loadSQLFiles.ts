import fs from "fs";
import path from "path";

const getSQLFile = (fileName: string) => {
    return fs.readFileSync(path.join(__dirname, "sql", fileName), {
        encoding: "utf-8",
    });
};

const getSQLFileWithSchema = (fileName: string, schema?: string) => {
    const sql = getSQLFile(fileName);

    if (!schema) {
        return sql;
    }

    return sql.replace(/\bpublic\./g, schema + ".");
};

export const getSeedSchemaSQL = (schema?: string) => {
    return getSQLFileWithSchema("seed_schema.sql", schema);
};

export const getSeedDataSQL = (schema?: string) => {
    return getSQLFileWithSchema("seed_data.sql", schema);
};

export const getCleanTablesSQL = (schema?: string) => {
    return getSQLFileWithSchema("clean_tables.sql", schema);
};

export const getCleanDBSQL = (schema?: string) => {
    return getSQLFileWithSchema("clean_db.sql", schema);
};
