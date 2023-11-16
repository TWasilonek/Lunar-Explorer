import express from "express";
import logger from "morgan";

import errorHandler from "./middleware/errorHandler";
import logErrors from "./middleware/logErrors";
import { isProduction } from "./utils/env";
import usersRouter from "./domains/users/users.router";
import reservationsRouter from "./domains/reservations/reservations.router";
import roomsRouter from "./domains/rooms/rooms.router";
import spaceshipsRouter from "./domains/spaceships/spaceships.router";

const app = express();

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
 * Routes
 */
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reservations", reservationsRouter);
app.use("/api/v1/rooms", roomsRouter);
app.use("/api/v1/spaceships", spaceshipsRouter);

/**
 * Error Handlers
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
