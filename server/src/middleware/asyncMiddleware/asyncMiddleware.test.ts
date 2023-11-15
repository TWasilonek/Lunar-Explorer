import asyncMiddleware from "./asyncMiddleware";

describe("asyncMiddleware", () => {
  test("should call the handler with req, res, and next", async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const handler = jest.fn();

    // @ts-ignore - we don't care if req matches the Request type
    await asyncMiddleware(handler)(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next with the error if the handler throws", async () => {
    const error = new Error("test error");
    const req = {};
    const res = {};
    const next = jest.fn();
    const handler = jest.fn().mockRejectedValue(error);

    // @ts-ignore - we don't care if req matches the Request type
    await asyncMiddleware(handler)(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
