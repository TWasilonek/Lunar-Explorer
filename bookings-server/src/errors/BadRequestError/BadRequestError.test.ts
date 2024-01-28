import { HttpStatusCode } from "../../constants";
import { BadRequestError } from "./BadRequestError";

describe("BadRequestError", () => {
    test("should have correct defaults", () => {
        const error = new BadRequestError();
        expect(error.name).toBe("BAD REQUEST");
        expect(error.httpCode).toBe(HttpStatusCode.BAD_REQUEST);
        expect(error.message).toBe("bad request");
    });

    test("should allow a custom error message", () => {
        const error = new BadRequestError("test error");
        expect(error.name).toBe("BAD REQUEST");
        expect(error.httpCode).toBe(HttpStatusCode.BAD_REQUEST);
        expect(error.message).toBe("test error");
    });
});
