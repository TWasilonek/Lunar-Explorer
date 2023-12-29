import { HttpStatusCode } from "../../constants";
import { UnauthorizedError } from "./UnauthorizedError";

describe("UnauthorizedError", () => {
    test("should have correct defaults", () => {
        const error = new UnauthorizedError();
        expect(error.name).toBe("UNAUTHORIZED");
        expect(error.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(error.message).toBe("Unauthorized");
    });

    test("should allow a custom error message", () => {
        const error = new UnauthorizedError("test error");
        expect(error.name).toBe("UNAUTHORIZED");
        expect(error.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(error.message).toBe("test error");
    });
});
