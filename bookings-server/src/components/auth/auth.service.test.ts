import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authConfig from "../../config/authConfig";
import { User } from "../../models/User";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import * as usersService from "../users/users.service";
import * as authService from "./auth.service";
import { DBUserMock } from "../../testHelpers/userMock";
import { InternalServerError } from "../../errors/InternalServerError";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../config/authConfig", () => ({
    __esModule: true,
    default: {
        jwt_secret: "secret",
        jwt_refresh_secret: "refreshSecret",
    },
}));
jest.mock("../../errors/UnauthorizedError");
jest.mock("../users/users.service");

describe("Auth Service", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        authConfig.default.jwt_secret = "secret";
        authConfig.default.jwt_refresh_secret = "refreshSecret";
    });

    describe("hashPassword", () => {
        test("should hash the password using bcrypt", () => {
            const password = "password";
            const hashedPassword = "hashedPassword";
            (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);

            const result = authService.hashPassword(password);

            expect(bcrypt.hashSync).toHaveBeenCalledWith(password);
            expect(result).toEqual(hashedPassword);
        });
    });

    describe("createAccessToken", () => {
        test("should create an access token using jwt", () => {
            const user: User = {
                ...DBUserMock,
            };
            const accessToken = "accessToken";
            (jwt.sign as jest.Mock).mockReturnValue(accessToken);

            const result = authService.createAccessToken(user);

            expect(jwt.sign).toHaveBeenCalledWith({ id: user.id }, "secret", {
                expiresIn: "1h",
            });
            expect(result).toEqual(accessToken);
        });

        test("should throw UnauthorizedError if jwt_secret is not defined", () => {
            const user: User = { ...DBUserMock };
            authConfig.default.jwt_secret = "";

            expect(() => authService.createAccessToken(user)).toThrow(
                UnauthorizedError,
            );
        });
    });

    describe("createRefreshToken", () => {
        test("should create a refresh token using jwt", () => {
            const user: User = {
                ...DBUserMock,
            };
            const refreshToken = "refreshToken";
            (jwt.sign as jest.Mock).mockReturnValue(refreshToken);

            const result = authService.createRefreshToken(user);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user.id },
                "refreshSecret",
                {
                    expiresIn: "1d",
                },
            );
            expect(result).toEqual(refreshToken);
        });

        test("should throw UnauthorizedError if jwt_refresh_secret is not defined", () => {
            const user: User = {
                ...DBUserMock,
            };
            authConfig.default.jwt_refresh_secret = "";

            expect(() => authService.createRefreshToken(user)).toThrow(
                UnauthorizedError,
            );
        });
    });

    describe("authenticate", () => {
        test("should authenticate user and return access and refresh tokens", () => {
            const password = "password";
            const accessToken = "accessToken";
            const refreshToken = "refreshToken";
            const user: User = {
                ...DBUserMock,
                password,
                refreshToken,
            };

            (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
            jest.spyOn(authService, "createAccessToken").mockReturnValue(
                accessToken,
            );
            jest.spyOn(authService, "createRefreshToken").mockReturnValue(
                refreshToken,
            );

            const result = authService.authenticate(user, password);

            expect(bcrypt.compareSync).toHaveBeenCalledWith(
                password,
                user.password,
            );
            expect(authService.createAccessToken).toHaveBeenCalledWith(user);
            expect(authService.createRefreshToken).toHaveBeenCalledWith(user);
            expect(result).toEqual({ accessToken, refreshToken });
        });

        test("should throw UnauthorizedError if password is invalid", () => {
            const user: User = {
                ...DBUserMock,
            };
            const password = "invalidPassword";
            (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

            expect(() => authService.authenticate(user, password)).toThrow(
                UnauthorizedError,
            );
        });
    });

    describe("validateRefreshToken", () => {
        test("should validate the refresh token and return the decoded payload", async () => {
            const refreshToken = "refreshToken";
            const decoded = { id: DBUserMock.id };
            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            (usersService.getUserById as jest.Mock).mockResolvedValue({
                ...DBUserMock,
                refreshToken: "refreshToken",
            });

            const result = await authService.validateRefreshToken(refreshToken);

            expect(jwt.verify).toHaveBeenCalledWith(
                refreshToken,
                "refreshSecret",
            );
            expect(usersService.getUserById).toHaveBeenCalledWith(decoded.id);
            expect(result).toEqual(decoded);
        });

        test("should throw UnauthorizedError if jwt_refresh_secret is not defined", async () => {
            const refreshToken = "refreshToken";
            authConfig.default.jwt_refresh_secret = "";

            await expect(
                authService.validateRefreshToken(refreshToken),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        test("should throw UnauthorizedError if refresh token is invalid", async () => {
            const refreshToken = "invalidToken";
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("Invalid token");
            });

            await expect(
                authService.validateRefreshToken(refreshToken),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        test("should throw UnauthorizedError if decoded payload is invalid", async () => {
            const refreshToken = "refreshToken";
            const decoded = "invalidPayload";
            (jwt.verify as jest.Mock).mockReturnValue(decoded);

            await expect(
                authService.validateRefreshToken(refreshToken),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        test("should throw UnauthorizedError if user's refresh token is not the same as the provided one", async () => {
            const refreshToken = "refreshToken";
            const userRefreshToken = "differentToken";
            const decoded = { id: DBUserMock.id };
            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            (usersService.getUserById as jest.Mock).mockResolvedValue({
                ...DBUserMock,
                refreshToken: userRefreshToken,
            });

            await expect(
                authService.validateRefreshToken(refreshToken),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });

        test("should throw UnauthorizedError if user's refresh token is null", async () => {
            const refreshToken = "refreshToken";
            const decoded = { id: DBUserMock.id };
            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            (usersService.getUserById as jest.Mock).mockResolvedValue({
                ...DBUserMock,
                refreshToken: null,
            });

            await expect(
                authService.validateRefreshToken(refreshToken),
            ).rejects.toBeInstanceOf(UnauthorizedError);
        });
    });

    describe("saveRefreshToken", () => {
        test("should update user with the new refresh token", async () => {
            const refreshToken = "refreshToken";
            const user: User = {
                ...DBUserMock,
            };
            (usersService.updateAndSaveUser as jest.Mock).mockResolvedValue(
                user,
            );

            await authService.saveRefreshToken(user, refreshToken);

            expect(usersService.updateAndSaveUser).toHaveBeenCalledWith(user, {
                refreshToken,
            });
        });

        test("should throw InternalServerError if an error occurs while updating the user", async () => {
            const refreshToken = "refreshToken";
            const user: User = {
                ...DBUserMock,
            };
            const error = new Error("Some error");
            (usersService.updateAndSaveUser as jest.Mock).mockRejectedValue(
                error,
            );

            await expect(
                authService.saveRefreshToken(user, refreshToken),
            ).rejects.toBeInstanceOf(InternalServerError);
        });
    });
});
