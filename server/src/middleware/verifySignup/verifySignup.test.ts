import { Request, Response } from "express";
import { userRepository } from "../../repositories/userRepository";
import { checkDuplicateUsernameOrEmail } from "./verifySignup";
import { DBUserMock } from "../../testHelpers/userMock";

describe("checkDuplicateUsernameOrEmail", () => {
    const req = {
        body: {
            email: "test@test.pl",
        },
    } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call next if the email is not in use", async () => {
        jest.spyOn(userRepository, "findByEmail").mockResolvedValueOnce(null);

        await checkDuplicateUsernameOrEmail(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("Should send a bad request response if the email is in use", async () => {
        jest.spyOn(userRepository, "findByEmail")
            //@ts-ignore
            .mockResolvedValueOnce(DBUserMock);

        await checkDuplicateUsernameOrEmail(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Email is already in use.",
        });
    });

    it("Should send an internal server error resopnse if the database query fails", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementationOnce(() => {});

        const errorMessage = "Database query failed";
        jest.spyOn(userRepository, "findByEmail").mockRejectedValueOnce(
            errorMessage,
        );

        await checkDuplicateUsernameOrEmail(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: errorMessage,
        });

        consoleErrorSpy.mockRestore();
    });
});
