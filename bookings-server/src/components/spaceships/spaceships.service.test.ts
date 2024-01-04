import { Spaceship } from "../../models/Spaceship";
import { getSeatsInShip } from "./spaceships.service";

describe("Spaceships service", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getSeatsInShip", () => {
        const spaceship: Spaceship = {
            id: 1,
            name: "Millennium Falcon",
            totalSeats: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
            model: "YT-1300 light freighter",
            manufacturer: {
                id: 1,
                name: "Corellian Engineering Corporation",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };

        it("should return an array of strings with length equal to totalSeats", () => {
            const result = getSeatsInShip(spaceship);
            expect(result).toEqual(["1", "2", "3", "4"]);
        });
    });
});
