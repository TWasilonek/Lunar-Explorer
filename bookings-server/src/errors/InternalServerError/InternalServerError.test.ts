import { HttpStatusCode } from "../../constants";
import { InternalServerError } from "./InternalServerError";

describe("InternalServerError", () => {
    test("should have correct defaults", () => {
        const error = new InternalServerError();
        expect(error.name).toBe("INTERNAL SERVER ERROR");
        expect(error.httpCode).toBe(HttpStatusCode.INTERNAL_SERVER);
        expect(error.message).toBe("internal server error");
    });

    test("should allow a custom error message", () => {
        const error = new InternalServerError("test error");
        expect(error.name).toBe("INTERNAL SERVER ERROR");
        expect(error.httpCode).toBe(HttpStatusCode.INTERNAL_SERVER);
        expect(error.message).toBe("test error");
    });
});
