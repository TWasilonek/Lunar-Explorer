import * as usersService from "./users.service";
import * as roomsService from "../rooms/rooms.service";
import * as bookingsService from "../bookings/bookings.service";
import {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserBookings,
} from "./users.controller";
import { DBUserMock } from "../../__mocks__/userMock";
import { User } from "../../models/User";
import { UpdateUserBody, UserProfile } from "../../types";

jest.mock("./users.service");
jest.mock("../rooms/rooms.service");
jest.mock("../bookings/bookings.service");

describe("Users Controller", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const mockUsers = [
                {
                    ...DBUserMock,
                    id: "1",
                },
                {
                    ...DBUserMock,
                    id: "2",
                },
            ];

            (usersService.getAllUsers as jest.Mock).mockResolvedValue(
                mockUsers,
            );

            const result = await getAllUsers();

            expect(result).toEqual(mockUsers);
            expect(usersService.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe("getUser", () => {
        it("should return a user by ID", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser = {
                ...DBUserMock,
            };

            (usersService.getUserById as jest.Mock).mockResolvedValue(mockUser);

            const result = await getUser(mockUserId);

            expect(result).toEqual(mockUser);
            expect(usersService.getUserById).toHaveBeenCalledTimes(1);
            expect(usersService.getUserById).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe("updateUser", () => {
        it("should update a user and return the updated user", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser: User = {
                ...DBUserMock,
            };
            const returnUser: UserProfile = {
                id: DBUserMock.id,
                firstName: DBUserMock.firstName,
                lastName: DBUserMock.lastName,
                email: DBUserMock.email,
                role: DBUserMock.role,
            };
            const mockData: Partial<UpdateUserBody> = {
                firstName: " Updated ",
                lastName: " User ",
                email: "updated.user@example.com",
            };
            const mockSanitizedData = {
                firstName: "Updated",
                lastName: "User",
                email: "updated.user@example.com",
            };

            (usersService.getUserById as jest.Mock).mockResolvedValue(mockUser);
            (usersService.updateAndSaveUser as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const result = await updateUser(mockUserId, mockData);

            expect(result).toEqual(returnUser);
            expect(usersService.getUserById).toHaveBeenCalledTimes(1);
            expect(usersService.getUserById).toHaveBeenCalledWith(mockUserId);
            expect(usersService.updateAndSaveUser).toHaveBeenCalledTimes(1);
            expect(usersService.updateAndSaveUser).toHaveBeenCalledWith(
                mockUser,
                mockSanitizedData,
            );
        });
    });

    describe("deleteUser", () => {
        it("should delete a user", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser: User = {
                ...DBUserMock,
            };
            const returnUser: UserProfile = {
                id: DBUserMock.id,
                firstName: DBUserMock.firstName,
                lastName: DBUserMock.lastName,
                email: DBUserMock.email,
                role: DBUserMock.role,
            };

            (usersService.deleteUser as jest.Mock).mockResolvedValue(mockUser);

            const deletedUser = await deleteUser(mockUserId);

            expect(deletedUser).toEqual(returnUser);
            expect(usersService.deleteUser).toHaveBeenCalledTimes(1);
            expect(usersService.deleteUser).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe("getUserBookings", () => {
        it("should return the bookings of a user with associated rooms", async () => {
            const mockUserId = DBUserMock.id;
            const mockUser: User = {
                ...DBUserMock,
            };
            const mockBookings = [
                {
                    id: "1",
                    userId: mockUserId,
                    roomId: "1",
                    startDate: new Date(),
                    endDate: new Date(),
                },
                {
                    id: "2",
                    userId: mockUserId,
                    roomId: "2",
                    startDate: new Date(),
                    endDate: new Date(),
                },
            ];
            const mockRooms = [
                {
                    id: "1",
                    name: "Room 1",
                    capacity: 2,
                },
                {
                    id: "2",
                    name: "Room 2",
                    capacity: 4,
                },
            ];
            const mockResult = [
                {
                    id: "1",
                    userId: mockUserId,
                    roomId: "1",
                    startDate: expect.any(Date),
                    endDate: expect.any(Date),
                    room: mockRooms[0],
                },
                {
                    id: "2",
                    userId: mockUserId,
                    roomId: "2",
                    startDate: expect.any(Date),
                    endDate: expect.any(Date),
                    room: mockRooms[1],
                },
            ];

            (usersService.getUserById as jest.Mock).mockResolvedValue(mockUser);
            (bookingsService.getBookingsByUser as jest.Mock).mockResolvedValue(
                mockBookings,
            );
            (roomsService.getRoomByBooking as jest.Mock)
                .mockResolvedValueOnce(mockRooms[0])
                .mockResolvedValueOnce(mockRooms[1]);

            const result = await getUserBookings(mockUserId);

            expect(result).toEqual(mockResult);
            expect(usersService.getUserById).toHaveBeenCalledTimes(1);
            expect(usersService.getUserById).toHaveBeenCalledWith(mockUserId);
            expect(bookingsService.getBookingsByUser).toHaveBeenCalledTimes(1);
            expect(bookingsService.getBookingsByUser).toHaveBeenCalledWith(
                mockUser,
            );
            expect(roomsService.getRoomByBooking).toHaveBeenCalledTimes(2);
            expect(roomsService.getRoomByBooking).toHaveBeenNthCalledWith(
                1,
                mockBookings[0],
            );
            expect(roomsService.getRoomByBooking).toHaveBeenNthCalledWith(
                2,
                mockBookings[1],
            );
        });
    });
});
