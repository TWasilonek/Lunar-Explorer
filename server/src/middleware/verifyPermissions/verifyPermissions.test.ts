import { Request, Response, NextFunction } from "express";
import { verifyPermissions } from "./verifyPermissions";
import { userRepository } from "../../models/user/UserRepository";
import { DBUserMock, userMock } from "../../testHelpers/userMock";
import { HttpStatusCode, Permissions, UserRole } from "../../constants";

describe("verifyPermissions", () => {
    const req = { body: { userId: DBUserMock.id } } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call next if the user has the required permissions", async () => {
        const permissions = [Permissions.READ];
        const user = {
            ...DBUserMock,
            role: UserRole.ADMIN,
        };

        jest.spyOn(userRepository, "findById")
            // @ts-ignore - We don't care about the whole repository object
            .mockResolvedValueOnce(user);

        await verifyPermissions(permissions)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    [
        [Permissions.READ],
        [Permissions.CREATE],
        [Permissions.UPDATE],
        [Permissions.DELETE],
    ].forEach((permissions) => {
        it("should send a forbidden response if the user does not have the required permissions", async () => {
            const user = {
                ...DBUserMock,
                role: UserRole.USER,
            };

            jest.spyOn(userRepository, "findById")
                // @ts-ignore - We don't care about the whole repository object
                .mockResolvedValueOnce(user);

            await verifyPermissions(permissions)(req, res, next);

            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN);
            expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
            expect(next).not.toHaveBeenCalled();
        });
    });

    it("should send a not found response if the user does not exist", async () => {
        jest.spyOn(userRepository, "findById")
            // @ts-ignore - We don't care about the whole repository object
            .mockResolvedValueOnce(null);

        await verifyPermissions([Permissions.READ])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
        expect(res.send).toHaveBeenCalledWith({ message: "User not found" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should send a forbidden response if the user role is not found", async () => {
        const user = {
            ...DBUserMock,
            role: "invalidRole",
        };

        jest.spyOn(userRepository, "findById")
            // @ts-ignore - We don't care about the whole repository object
            .mockResolvedValueOnce(user);

        await verifyPermissions([Permissions.READ])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN);
        expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should send a forbidden response if there is an error thrown while fetching the user", async () => {
        const errorMessage = "Error while fetching user";
        jest.spyOn(userRepository, "findById").mockRejectedValueOnce({
            message: errorMessage,
        });

        await verifyPermissions([Permissions.READ])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN);
        expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
    });
});
