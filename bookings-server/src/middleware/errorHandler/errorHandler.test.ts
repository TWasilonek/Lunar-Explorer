import { HttpStatusCode } from "../../constants";
import { BadRequestError } from "../../errors/BadRequestError";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";
import errorHandler from "./errorHandler";
import { isProduction } from "../../utils/env";

jest.mock("../../utils/env");

describe("errorHandler middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isProduction as jest.Mock).mockReturnValue(false);
  });

  test("for unhandled errors, responds with 500 and the error object", () => {
    const req = {};
    const res = {
      headersSent: false,
      json: jest.fn(),
      status: jest.fn(),
    };
    const next = jest.fn();

    const error = new Error("test error");

    // @ts-ignore - req is not used in this test
    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
      stack: error.stack,
    });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("for BadRequestError, responds with 400 and the error message", () => {
    const req = {};
    const res = {
      headersSent: false,
      json: jest.fn(),
      status: jest.fn(),
    };
    const next = jest.fn();

    const error = new BadRequestError();

    // @ts-ignore - req is not used in this test
    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("for NotFoundError, responds with 404 and the error message", () => {
    const req = {};
    const res = {
      headersSent: false,
      json: jest.fn(),
      status: jest.fn(),
    };
    const next = jest.fn();

    const error = new NotFoundError();

    // @ts-ignore - req is not used in this test
    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("for InternalServerError, responds with 500 and the error message", () => {
    const req = {};
    const res = {
      headersSent: false,
      json: jest.fn(),
      status: jest.fn(),
    };
    const next = jest.fn();

    const error = new InternalServerError();

    // @ts-ignore - req is not used in this test
    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("does not respond and calls next(), if headersSent is true", () => {
    const req = {};
    const res = {
      headersSent: true,
      json: jest.fn(),
      status: jest.fn(),
    };
    const next = jest.fn();

    const error = new Error("test error");

    // @ts-ignore - req is not used in this test
    errorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("does not add a stack trace to the response in production", () => {
    (isProduction as jest.Mock).mockReturnValue(true);

    const req = {};
    const res = {
      headersSent: false,
      json: jest.fn(),
      status: jest.fn(),
    };
    const next = jest.fn();
    const error = new Error("test error");

    // @ts-ignore - req is not used in this test
    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
