import { Request, Response } from "express";
import { checkDuplicateUsernameOrEmail } from "./verifySignup";
import { DBUserMock } from "../../__mocks__/userMock";

const mockUserRepository = {
    findByEmail: jest.fn(),
};
jest.mock("../../repositories/userRepository", () => ({
    getUserRepository: jest.fn().mockImplementation(() => {
        return mockUserRepository;
    }),
}));

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

    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementationOnce(() => {});
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call next if the email is not in use", async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);

        await checkDuplicateUsernameOrEmail(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("Should send a bad request response if the email is in use", async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(DBUserMock);

        await checkDuplicateUsernameOrEmail(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Email is already in use.",
        });
    });

    it("Should send an internal server error resopnse if the database query fails", async () => {
        const errorMessage = "Database query failed";
        mockUserRepository.findByEmail.mockRejectedValueOnce(errorMessage);

        await checkDuplicateUsernameOrEmail(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: errorMessage,
        });
    });
});
