import { HttpStatusCode } from "../../constants";
import { BaseError } from "./BaseError";

describe("BaseError", () => {
    test("should have the correct props and be an instance of Error", () => {
        const error = new BaseError("test", HttpStatusCode.BAD_REQUEST, "test");
        expect(error.name).toBe("test");
        expect(error.httpCode).toBe(HttpStatusCode.BAD_REQUEST);
        expect(error.message).toBe("test");
        expect(error.stack).toBeDefined();
        expect(error).toBeInstanceOf(Error);
    });
});
