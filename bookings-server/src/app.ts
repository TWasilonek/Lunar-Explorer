import "dotenv/config";
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";

import errorHandler from "./middleware/errorHandler";
import logErrors from "./middleware/logErrors";
import { isProduction } from "./utils/env";
import usersRouter from "./components/users/users.router";
import authRouter from "./components/auth/auth.router";
import tripsRouter from "./components/trips/trips.router";
import bookingsRouter from "./components/bookings/bookings.router";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createTripRepository } from "./repositories/tripRepository";
import { createBookingRepository } from "./repositories/bookingRepository";
import { createDataSource } from "./db/dataSource";
import { createFlightOccupancyRepository } from "./repositories/flightOccupancyRepository";
import { createFlightRepository } from "./repositories/flightRepository";
import { createRoomOccupancyRepository } from "./repositories/roomOccupancyRepository";
import { createRoomRepository } from "./repositories/roomRepository";
import { createUserRepository } from "./repositories/userRepository";

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
    const dataSource = await createDataSource(dbConfig);

    createUserRepository(dataSource);
    createTripRepository(dataSource);
    createBookingRepository(dataSource);
    createFlightRepository(dataSource);
    createRoomRepository(dataSource);
    createFlightOccupancyRepository(dataSource);
    createRoomOccupancyRepository(dataSource);

    return app;
};
