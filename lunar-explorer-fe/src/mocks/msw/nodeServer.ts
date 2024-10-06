import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// confirmation that the serve started
server.events.on("request:start", ({ request }) => {
  console.log("MSW intercepted:", request.method, request.url);
});
