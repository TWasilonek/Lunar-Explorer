import * as usersService from "../users/users.service";
import * as authService from "./auth.service";
import { ReturnUser, SaveUser } from "../../types";
import { InternalServerError } from "../../errors/InternalServerError";
import { signup, signin, logout, refreshTokens } from "./auth.controller";
import { UserRole } from "../../constants";
import { userMock } from "../../testHelpers/userMock";

jest.mock("../users/users.service");
jest.mock("./auth.service");

describe("Auth Controller", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("signup", () => {
        test("should create and save a new user", async () => {
            const user: SaveUser = {
                firstName: " John ",
                lastName: " Doe ",
                email: " JOHN.doe@example.com    ",
                password: "password",
            };

            const sanitizedData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "hashedPassword",
            };

            const createdUser: ReturnUser = {
                id: "123",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                role: UserRole.USER,
            };

            (usersService.createAndSaveUser as jest.Mock).mockResolvedValue(
                createdUser,
            );
            (authService.hashPassword as jest.Mock).mockReturnValue(
                "hashedPassword",
            );

            const result = await signup(user);
            expect(usersService.createAndSaveUser).toHaveBeenCalledWith(
                sanitizedData,
            );
            expect(result).toEqual(createdUser);
        });
    });

    describe("signin", () => {
        test("should authenticate user and return user data with access and refresh tokens", async () => {
            const user: ReturnUser = {
                id: "123",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                role: UserRole.USER,
            };

            const accessToken = "accessToken";
            const refreshToken = "refreshToken";

            (usersService.getUserByEmail as jest.Mock).mockResolvedValue(user);
            (authService.authenticate as jest.Mock).mockReturnValue({
                accessToken,
                refreshToken,
            });

            const result = await signin({
                email: "john.doe@example.com",
                password: "password",
            });

            expect(usersService.getUserByEmail).toHaveBeenCalledWith(
                "john.doe@example.com",
            );
            expect(authService.authenticate).toHaveBeenCalledWith(
                user,
                "password",
            );
            expect(authService.saveRefreshToken).toHaveBeenCalledWith(
                user,
                refreshToken,
            );
            expect(result).toEqual({
                user,
                accessToken,
                refreshToken,
            });
        });
    });

    describe("logout", () => {
        test("should update user with null refreshToken", async () => {
            const userId = userMock.id;
            const user: ReturnUser = { ...userMock };

            (usersService.getUserById as jest.Mock).mockResolvedValue(user);
            (usersService.updateAndSaveUser as jest.Mock).mockResolvedValue(
                user,
            );

            await logout(userId);

            expect(usersService.updateAndSaveUser).toHaveBeenCalledWith(user, {
                refreshToken: null,
            });
        });

        test("should throw InternalServerError if an error occurs while retrieving the user", async () => {
            const userId = "123";
            const error = new Error("Some error");

            (usersService.getUserById as jest.Mock).mockRejectedValue(error);
            await expect(logout(userId)).rejects.toThrow(InternalServerError);
        });

        test("should throw InternalServerError if an error occurs while updating the user", async () => {
            const userId = "123";
            const error = new Error("Some error");

            (usersService.createAndSaveUser as jest.Mock).mockRejectedValue(
                error,
            );
            await expect(logout(userId)).rejects.toThrow(InternalServerError);
        });
    });

    describe("refreshTokens", () => {
        test("should validate refresh token, create new access token and refresh token, and save refresh token", async () => {
            const refreshToken = "refreshToken";
            const decoded = { id: userMock.id };
            const user: ReturnUser = {
                ...userMock,
            };
            const accessToken = "accessToken";
            const newRefreshToken = "newRefreshToken";

            (authService.validateRefreshToken as jest.Mock).mockResolvedValue(
                decoded,
            );
            (usersService.getUserById as jest.Mock).mockResolvedValue(user);
            (authService.createAccessToken as jest.Mock).mockReturnValue(
                accessToken,
            );
            (authService.createRefreshToken as jest.Mock).mockReturnValue(
                newRefreshToken,
            );
            // (authService.saveRefreshToken as jest.Mock).mockResolvedValue();

            const result = await refreshTokens(refreshToken);

            expect(authService.validateRefreshToken).toHaveBeenCalledWith(
                refreshToken,
            );
            expect(usersService.getUserById).toHaveBeenCalledWith(decoded.id);
            expect(authService.createAccessToken).toHaveBeenCalledWith(user);
            expect(authService.createRefreshToken).toHaveBeenCalledWith(user);
            expect(authService.saveRefreshToken).toHaveBeenCalledWith(
                user,
                refreshToken,
            );
            expect(result).toEqual({
                accessToken,
                refreshToken: newRefreshToken,
            });
        });

        test("should throw InternalServerError if decoding refresh token fails", async () => {
            const refreshToken = "refreshToken";

            (authService.validateRefreshToken as jest.Mock).mockResolvedValue(
                null,
            );

            await expect(refreshTokens(refreshToken)).rejects.toThrow(
                InternalServerError,
            );
        });
    });
});
