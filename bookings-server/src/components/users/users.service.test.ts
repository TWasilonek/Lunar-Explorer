import { DBUserMock, userMock } from "../../__mocks__/userMock";
import { NotFoundError } from "../../errors/NotFoundError";
import { UpdateUserBody } from "../../types";
import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createAndSaveUser,
    updateAndSaveUser,
    deleteUser,
} from "./users.service";

const mockUserRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};
jest.mock("../../repositories/userRepository", () => ({
    getUserRepository: jest.fn().mockImplementation(() => {
        return mockUserRepository;
    }),
}));

describe("Users Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const mockUsers = [
                { ...DBUserMock, id: "1" },
                { ...DBUserMock, id: "2" },
            ];
            mockUserRepository.find.mockResolvedValueOnce(mockUsers);

            const result = await getAllUsers();

            expect(result).toEqual(mockUsers);
            expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("getUserById", () => {
        it("should return the user with the given ID", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser = { ...DBUserMock };
            mockUserRepository.findById.mockResolvedValueOnce(mockUser);

            const result = await getUserById(mockUserId);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(
                mockUserId,
            );
        });

        it("should throw NotFoundError if user is not found", async () => {
            const mockUserId = "1";
            mockUserRepository.findById.mockResolvedValueOnce(null);

            await expect(getUserById(mockUserId)).rejects.toThrow(
                NotFoundError,
            );
            expect(mockUserRepository.findById).toHaveBeenCalledWith(
                mockUserId,
            );
        });
    });

    describe("getUserByEmail", () => {
        it("should return the user with the given email", async () => {
            const mockEmail = DBUserMock.email;
            const mockUser = { ...DBUserMock };
            mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);

            const result = await getUserByEmail(mockEmail);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
                mockEmail,
            );
        });

        it("should throw NotFoundError if user is not found", async () => {
            const mockEmail = "john@example.com";
            mockUserRepository.findByEmail.mockResolvedValueOnce(null);

            await expect(getUserByEmail(mockEmail)).rejects.toThrow(
                NotFoundError,
            );
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
                mockEmail,
            );
        });
    });

    describe("createAndSaveUser", () => {
        it("should create and save a new user", async () => {
            const newUser: UpdateUserBody = {
                firstName: userMock.firstName,
                lastName: userMock.lastName,
                email: userMock.email,
            };
            const mockNewUser = { ...userMock };
            mockUserRepository.create.mockReturnValue(mockNewUser);
            mockUserRepository.save.mockResolvedValueOnce(mockNewUser);

            const result = await createAndSaveUser(newUser);

            expect(result).toEqual(mockNewUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
            expect(mockUserRepository.save).toHaveBeenCalledWith(mockNewUser);
        });
    });

    describe("updateAndSaveUser", () => {
        it("should update and save the user", async () => {
            const mockUser = {
                ...DBUserMock,
            };
            const newData = { firstName: "John Smith" };
            mockUserRepository.merge.mockReturnValue(undefined);
            mockUserRepository.save.mockResolvedValueOnce(mockUser);

            const result = await updateAndSaveUser(mockUser, newData);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.merge).toHaveBeenCalledWith(
                mockUser,
                newData,
            );
            expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
        });
    });

    describe("deleteUser", () => {
        it("should delete the user with the given ID", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser = { ...DBUserMock };
            mockUserRepository.findById.mockResolvedValueOnce(mockUser);
            mockUserRepository.delete.mockResolvedValueOnce(undefined);

            const result = await deleteUser(mockUserId);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(
                mockUserId,
            );
            expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUserId);
        });

        it("should throw NotFoundError if user is not found", async () => {
            const mockUserId = "1";
            mockUserRepository.findById.mockResolvedValueOnce(null);

            await expect(deleteUser(mockUserId)).rejects.toThrow(NotFoundError);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(
                mockUserId,
            );
            expect(mockUserRepository.delete).not.toHaveBeenCalled();
        });
    });
});
