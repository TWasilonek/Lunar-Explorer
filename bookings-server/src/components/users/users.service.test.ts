import { DBUserMock, userMock } from "../../__mocks__/userMock";
import { NotFoundError } from "../../errors/NotFoundError";
import { User } from "../../models/User";
import { userRepository } from "../../repositories/userRepository";
import { SaveUser } from "./users.controller";
import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createAndSaveUser,
    updateAndSaveUser,
    deleteUser,
} from "./users.service";

jest.mock("../../repositories/userRepository");

describe("Users Service", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const mockUsers = [
                { ...DBUserMock, id: "1" },
                { ...DBUserMock, id: "2" },
            ];
            (userRepository.find as jest.Mock).mockResolvedValue(mockUsers);

            const result = await getAllUsers();

            expect(result).toEqual(mockUsers);
            expect(userRepository.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("getUserById", () => {
        it("should return the user with the given ID", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser = { ...DBUserMock };
            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await getUserById(mockUserId);

            expect(result).toEqual(mockUser);
            expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
        });

        it("should throw NotFoundError if user is not found", async () => {
            const mockUserId = "1";
            (userRepository.findById as jest.Mock).mockResolvedValue(null);

            await expect(getUserById(mockUserId)).rejects.toThrow(
                NotFoundError,
            );
            expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe("getUserByEmail", () => {
        it("should return the user with the given email", async () => {
            const mockEmail = DBUserMock.email;
            const mockUser = { ...DBUserMock };
            (userRepository.findByEmail as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const result = await getUserByEmail(mockEmail);

            expect(result).toEqual(mockUser);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
        });

        it("should throw NotFoundError if user is not found", async () => {
            const mockEmail = "john@example.com";
            (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(getUserByEmail(mockEmail)).rejects.toThrow(
                NotFoundError,
            );
            expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
        });
    });

    describe("createAndSaveUser", () => {
        it("should create and save a new user", async () => {
            const newUser: SaveUser = {
                firstName: userMock.firstName,
                lastName: userMock.lastName,
                email: userMock.email,
                password: "123",
            };
            const mockNewUser = { ...userMock };
            (userRepository.create as jest.Mock).mockReturnValue(mockNewUser);
            (userRepository.save as jest.Mock).mockResolvedValue(mockNewUser);

            const result = await createAndSaveUser(newUser);

            expect(result).toEqual(mockNewUser);
            expect(userRepository.create).toHaveBeenCalledWith(newUser);
            expect(userRepository.save).toHaveBeenCalledWith(mockNewUser);
        });
    });

    describe("updateAndSaveUser", () => {
        it("should update and save the user", async () => {
            const mockUser = {
                ...DBUserMock,
            };
            const newData = { firstName: "John Smith" };
            (userRepository.merge as jest.Mock).mockReturnValue(undefined);
            (userRepository.save as jest.Mock).mockResolvedValue(mockUser);

            const result = await updateAndSaveUser(mockUser, newData);

            expect(result).toEqual(mockUser);
            expect(userRepository.merge).toHaveBeenCalledWith(
                mockUser,
                newData,
            );
            expect(userRepository.save).toHaveBeenCalledWith(mockUser);
        });
    });

    describe("deleteUser", () => {
        it("should delete the user with the given ID", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser = { ...DBUserMock };
            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (userRepository.delete as jest.Mock).mockResolvedValue(undefined);

            const result = await deleteUser(mockUserId);

            expect(result).toEqual(mockUser);
            expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
            expect(userRepository.delete).toHaveBeenCalledWith(mockUserId);
        });

        it("should throw NotFoundError if user is not found", async () => {
            const mockUserId = "1";
            (userRepository.findById as jest.Mock).mockResolvedValue(null);

            await expect(deleteUser(mockUserId)).rejects.toThrow(NotFoundError);
            expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
            expect(userRepository.delete).not.toHaveBeenCalled();
        });
    });
});
