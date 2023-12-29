import { HttpStatusCode } from "../../constants";
import { NotFoundError } from "./NotFoundError";

describe("NotFoundError", () => {
  test("should have correct defaults", () => {
    const error = new NotFoundError();
    expect(error.name).toBe("NOT FOUND");
    expect(error.httpCode).toBe(HttpStatusCode.NOT_FOUND);
    expect(error.message).toBe("not found");
  });

  test("should allow a custom error message", () => {
    const error = new NotFoundError("test error");
    expect(error.name).toBe("NOT FOUND");
    expect(error.httpCode).toBe(HttpStatusCode.NOT_FOUND);
    expect(error.message).toBe("test error");
  });
});
