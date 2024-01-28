import logErrors from ".";
import { isProduction } from "../../utils/env";

jest.mock("../../utils/env");

const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

describe("logErrors middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (isProduction as jest.Mock).mockReturnValue(false);
    });

    test("should log error if not in production", () => {
        const error = new Error("test error");
        const req = {};
        const res = {
            headersSent: false,
        };
        const next = jest.fn();

        // @ts-ignore - req is not used in this test
        logErrors(error, req, res, next);

        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledWith(error);
    });

    test("does not log the error if headerSent is true", () => {
        const error = new Error("test error");
        const req = {};
        const res = {
            headersSent: true,
        };
        const next = jest.fn();

        // @ts-ignore - req is not used in this test
        logErrors(error, req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test("does not log the error if in production", () => {
        (isProduction as jest.Mock).mockReturnValue(true);
        const error = new Error("test error");
        const req = {};
        const res = {
            headersSent: false,
        };
        const next = jest.fn();

        // @ts-ignore - req is not used in this test
        logErrors(error, req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(consoleErrorSpy).not.toHaveBeenCalledWith(error);
    });
});
