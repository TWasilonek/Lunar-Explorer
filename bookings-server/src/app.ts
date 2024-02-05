import "dotenv/config";
import "reflect-metadata";
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import errorHandler from "./middleware/errorHandler";
import logErrors from "./middleware/logErrors";
import { isProduction } from "./utils/env";
import usersRouter from "./components/users/users.router";
import authRouter from "./components/auth/auth.router";
import tripsRouter from "./components/trips/trips.router";
import bookingsRouter from "./components/bookings/bookings.router";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createDataSource } from "./db/dataSource";

const app = express();

/**
 * CONFIG
 */
app.use(logger("dev"));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// add cookies
app.use(cookieParser());

let corsOptions: cors.CorsOptions;

if (isProduction() && process.env.FE_PRODUCTION_ORIGIN) {
    corsOptions = {
        origin: [process.env.FE_PRODUCTION_ORIGIN],
    };
} else {
    corsOptions = {
        origin: "http://localhost:3000",
    };
}

app.use(cors(corsOptions));

/**
 * ROUTES
 */
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/trips", tripsRouter);
app.use("/api/v1/bookings", bookingsRouter);

/**
 * ERROR_HANDLING
 */
app.use(logErrors);
app.use(errorHandler);

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on("unhandledRejection", (reason: Error) => {
    // throwing from here will pass the error to the Express middleware
    throw reason;
});

process.on("uncaughtException", (error: Error) => {
    if (!isProduction()) {
        console.error("There was an uncaught error", error);
    }

    // this will exit the app with the appropriate code
    // we can use a process manager on the server to restart the app after such failures
    process.exit(1);
});

export const createApp = async (dbConfig: PostgresConnectionOptions) => {
    await createDataSource(dbConfig);
    return app;
};
