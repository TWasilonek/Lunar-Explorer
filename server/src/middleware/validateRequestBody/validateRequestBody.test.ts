import { Request, Response, NextFunction } from "express";
import joi from "joi";
import { validateRequestBody } from "./validateRequestBody";
import { HttpStatusCode } from "../../constants";

describe("validateRequestBody", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {} as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
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
        const validateAsyncMock = jest
            .spyOn(schema, "validateAsync")
            .mockRejectedValueOnce({ message: errorMessage });

        await validateRequestBody(schema)(req, res, next);

        expect(validateAsyncMock).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
        expect(res.send).toHaveBeenCalledWith({ message: errorMessage });
        expect(next).not.toHaveBeenCalled();
    });
});
