import supertest from "supertest";
import { TestDBContext } from "../../utils/testHelpers/TestDBContext";
import { RoomType } from "../../constants";

const BASE_ROUTE = "/api/v1/bookings";
const LOGIN_ROUTE = "/api/v1/auth/login";

const user1 = {
    id: "aea84ac4-62dd-4592-8759-aae7a064f6cf",
    firstName: "Mia",
    lastName: "Taylor",
    email: "mia.taylor@email.com",
    password: "test12345",
    bookingNumber: "012345",
};

const user2 = {
    id: "0d937c43-6ea5-40a8-9bda-0c0f0a7f8f2b",
    firstName: "Ava",
    lastName: "Martin",
    email: "ava.martin@email.com",
    password: "test12345",
    bookingNumber: "012346",
};

const context = new TestDBContext();

const loginUser1 = async (request: supertest.SuperTest<supertest.Test>) =>
    await request.post(LOGIN_ROUTE).send({
        email: user1.email,
        password: user1.password,
    });

describe("Bookings REST API", () => {
    let request: supertest.SuperTest<supertest.Test>;

    beforeAll(async () => {
        await context.createApp();
        await context.seedSchema();
        await context.seedData();
        request = supertest(context.app);
    });

    afterAll(async () => {
        await context.destroy();
    });

    describe(`POST ${BASE_ROUTE}/`, () => {
        test(`POST ${BASE_ROUTE}/ Success`, async () => {
            const loginResponse = await loginUser1(request);
            const response = await request
                .post(BASE_ROUTE)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                )
                .send({
                    userId: user1.id,
                    tripId: 1,
                    roomType: RoomType.SINGLE,
                    numberOfGuests: 1,
                    guestNames: ["Mia Taylor"],
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    bookingNumber: expect.any(String),
                    numberOfGuests: 1,
                    guestNames: ["Mia Taylor"],
                    trip: expect.objectContaining({
                        id: 1,
                    }),
                    user: expect.objectContaining({
                        id: user1.id,
                        firstName: user1.firstName,
                        lastName: user1.lastName,
                        email: user1.email,
                        role: expect.any(String),
                    }),
                    room: expect.any(Object),
                }),
            );
        });

        test(`POST ${BASE_ROUTE}/ not logged in`, async () => {
            const response = await request.post(BASE_ROUTE).send({
                userId: user1.id,
                tripId: 1,
                roomType: RoomType.SINGLE,
                numberOfGuests: 1,
                guestNames: ["Mia Taylor"],
            });

            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });

    describe(`GET ${BASE_ROUTE}/:bookingNumber`, () => {
        test(`GET ${BASE_ROUTE}/:bookingNumber Success`, async () => {
            const loginResponse = await loginUser1(request);
            const response = await request
                .get(`${BASE_ROUTE}/${user1.bookingNumber}`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                );

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    bookingNumber: user1.bookingNumber,
                    user: expect.objectContaining({
                        id: user1.id,
                        firstName: user1.firstName,
                        lastName: user1.lastName,
                        email: user1.email,
                        role: expect.any(String),
                    }),
                    room: expect.objectContaining({
                        capacity: 1,
                    }),
                }),
            );
        });

        test(`GET ${BASE_ROUTE}/:bookingNumber Not Found`, async () => {
            const loginResponse = await loginUser1(request);
            const response = await request
                .get(`${BASE_ROUTE}/not-a-booking-number`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                );

            expect(response.status).toBe(404);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Booking with booking number: "not-a-booking-number" not found.",
                }
            `);
        });

        test(`GET ${BASE_ROUTE}/:bookingNumber by user not owning booking`, async () => {
            const loginResponse = await loginUser1(request);

            const response = await request
                .get(`${BASE_ROUTE}/${user2.bookingNumber}`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                );

            expect(response.status).toBe(403);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Forbidden",
                }
            `);
        });

        test(`GET ${BASE_ROUTE}/:bookingNumber not logged in`, async () => {
            const response = await request.get(
                `${BASE_ROUTE}/${user1.bookingNumber}`,
            );

            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });
});
