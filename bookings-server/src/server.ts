import "dotenv/config";
import { createApp } from "./app";
import { isProduction } from "./utils/env";
import { dbConfig } from "./db/devConfig";

const port = process.env.PORT || 8000;

export const runServer = async () => {
    const app = await createApp(dbConfig);
    /**
     * Start Express server.
     */
    app.listen({ port }, () => {
        const message = isProduction()
            ? "  App is listening on port %d in %s mode"
            : "  App is running at http://localhost:%d in %s mode";

        console.log(message, port, app.get("env"));

        if (!isProduction()) {
            console.log("  Press CTRL-C to stop\n");
        }
    });
};
