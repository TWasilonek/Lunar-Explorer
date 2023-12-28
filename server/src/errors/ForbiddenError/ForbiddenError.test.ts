import { HttpStatusCode } from "../../constants";
import { ForbiddenError } from "./ForbiddenError";

describe("ForbiddenError", () => {
    test("should have correct defaults", () => {
        const error = new ForbiddenError();
        expect(error.name).toBe("FORBIDDEN");
        expect(error.httpCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(error.message).toBe("Forbidden");
    });

    test("should allow a custom error message", () => {
        const error = new ForbiddenError("test error");
        expect(error.name).toBe("FORBIDDEN");
        expect(error.httpCode).toBe(HttpStatusCode.FORBIDDEN);
        expect(error.message).toBe("test error");
    });
});
