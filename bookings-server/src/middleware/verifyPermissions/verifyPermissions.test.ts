import { Request, Response } from "express";
import { verifyPermissions } from "./verifyPermissions";
import { AdminPermissions, UserRole } from "../../types";
import { DBUserMock } from "../../__mocks__/userMock";
import { HttpStatusCode } from "../../constants";

const mockUserRepository = {
    findById: jest.fn(),
};
jest.mock("../../repositories/userRepository", () => ({
    getUserRepository: jest.fn().mockImplementation(() => {
        return mockUserRepository;
    }),
}));

describe("verifyPermissions", () => {
    const req = { body: { userId: DBUserMock.id } } as Request;
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

    it("should call next if the user has the required permissions", async () => {
        const permissions = [AdminPermissions.READ];
        const user = {
            ...DBUserMock,
            role: UserRole.ADMIN,
        };

        mockUserRepository.findById.mockResolvedValueOnce(user);

        await verifyPermissions(permissions)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    [
        [AdminPermissions.READ],
        [AdminPermissions.CREATE],
        [AdminPermissions.UPDATE],
        [AdminPermissions.DELETE],
    ].forEach((permissions) => {
        it("should send a forbidden response if the user does not have the required permissions", async () => {
            const user = {
                ...DBUserMock,
                role: UserRole.USER,
            };

            mockUserRepository.findById.mockResolvedValueOnce(user);

            await verifyPermissions(permissions)(req, res, next);

            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN);
            expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
            expect(next).not.toHaveBeenCalled();
        });
    });

    it("should send a not found response if the user does not exist", async () => {
        mockUserRepository.findById.mockResolvedValueOnce(null);

        await verifyPermissions([AdminPermissions.READ])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
        expect(res.send).toHaveBeenCalledWith({ message: "User not found" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should send a forbidden response if the user role is not found", async () => {
        const user = {
            ...DBUserMock,
            role: "invalidRole",
        };

        mockUserRepository.findById.mockResolvedValueOnce(user);

        await verifyPermissions([AdminPermissions.READ])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN);
        expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should send a forbidden response if there is an error thrown while fetching the user", async () => {
        const errorMessage = "Error while fetching user";
        mockUserRepository.findById.mockRejectedValueOnce({
            message: errorMessage,
        });

        await verifyPermissions([AdminPermissions.READ])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN);
        expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
    });
});
