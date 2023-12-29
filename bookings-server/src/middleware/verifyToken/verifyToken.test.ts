import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "./verifyToken";
import * as authConfig from "../../config/authConfig";

jest.mock("../../config/authConfig", () => ({
    __esModule: true,
    default: {
        secret: "secret",
    },
}));
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

describe("verifyToken", () => {
    const jwtVerifyMock = jwt.verify as jest.Mock;
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
            headers: { authorization: "Bearer token" },
        } as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
        consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementationOnce(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should call next and add the 'userId' prop to the request body if the token is valid", async () => {
        jwtVerifyMock.mockImplementationOnce((token, secret, cb) => {
            cb(null, { id: "id" });
        });

        verifyToken(req, res, next);

        expect(req.body.userId).toBe("id");
        expect(next).toHaveBeenCalled();
    });

    ["", "Bearer"].forEach((authHeader) => {
        it("should send a forbidden response if there is no bearer token", async () => {
            req.headers = {
                authorization: authHeader,
            };

            verifyToken(req, res, next);

            expect(req.body.userId).toBeFalsy();
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
        });
    });

    it("should send an internal server error response if there is no secret", async () => {
        authConfig.default.jwt_secret = undefined;

        verifyToken(req, res, next);

        expect(req.body.userId).toBeFalsy();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: "Something went wrong. Try again later.",
        });

        authConfig.default.jwt_secret = "secret";
    });

    it("should send an unauthorized response if the token is invalid", async () => {
        jwtVerifyMock.mockImplementationOnce((token, secret, cb) => {
            cb("error", null);
        });

        verifyToken(req, res, next);

        expect(req.body.userId).toBeFalsy();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
});
