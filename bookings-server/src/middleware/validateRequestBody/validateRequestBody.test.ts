import { Request, Response, NextFunction } from "express";
import joi from "joi";
import { validateRequestBody } from "./validateRequestBody";
import { HttpStatusCode } from "../../constants";

describe("validateRequestBody", () => {
    const req = {} as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call next if the request body is valid", async () => {
        // For the test's sake, it doesn't matter what is in the schema, we are mocking the validation result.
        const schema = joi.object({});
        req.body = {};

        await validateRequestBody(schema)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should send a bad request response if the request body is invalid", async () => {
        // For the test's sake, it doesn't matter what is in the schema, we are mocking the validation result.
        const schema = joi.object({});
        req.body = {};

        const errorMessage = "Invalid request body";
        jest.spyOn(schema, "validateAsync").mockRejectedValueOnce({
            message: errorMessage,
        });

        await validateRequestBody(schema)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
        expect(res.send).toHaveBeenCalledWith({ message: errorMessage });
        expect(next).not.toHaveBeenCalled();
    });
});
