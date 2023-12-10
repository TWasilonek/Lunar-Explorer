import "dotenv/config";
import express from "express";
import logger from "morgan";

import errorHandler from "./middleware/errorHandler";
import logErrors from "./middleware/logErrors";
import { isProduction } from "./utils/env";
import { appDataSource, dbConfig } from "./database/app-data-source";
import usersRouter from "./components/users/users.router";
import authRouter from "./components/auth/auth.router";

const app = express();
/**
 * DATABASE
 */
appDataSource
    .initialize()
    .then(() => {
        console.log(`Database connected on port ${dbConfig.port}`);
    })
    .catch((error) => console.error(error));

/**
 * CONFIG
 */
const port = process.env.PORT || 8000;

app.use(logger("dev"));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/**
 * ROUTES
 */
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);

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

/**
 * Start Express server.
 */
const server = app.listen({ port }, () => {
    const message = isProduction()
        ? "  App is listening on port %d in %s mode"
        : "  App is running at http://localhost:%d in %s mode";

    console.log(message, port, app.get("env"));

    if (!isProduction()) {
        console.log("  Press CTRL-C to stop\n");
    }
});

export default server;
