import supertest from "supertest";
import { TestDBContext } from "../../utils/testHelpers/TestDBContext";
import { RoomType } from "../../types";
import {
    loginUserWithBooking1,
    userWithBooking1,
    userWithBooking2,
} from "../../utils/testHelpers/testDBUsers";

const BASE_ROUTE = "/api/v1/bookings";

const context = new TestDBContext();

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
            const loginResponse = await loginUserWithBooking1(request);
            const response = await request
                .post(BASE_ROUTE)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                )
                .send({
                    userId: userWithBooking1.id,
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
                        flightToMoon: expect.objectContaining({
                            seats: expect.arrayContaining([expect.any(String)]),
                        }),
                        flightToEarth: expect.objectContaining({
                            seats: expect.arrayContaining([expect.any(String)]),
                        }),
                    }),
                    user: expect.objectContaining({
                        id: userWithBooking1.id,
                        firstName: userWithBooking1.firstName,
                        lastName: userWithBooking1.lastName,
                        email: userWithBooking1.email,
                        role: expect.any(String),
                    }),
                    room: expect.any(Object),
                }),
            );
        });

        test(`POST ${BASE_ROUTE}/ not logged in`, async () => {
            const response = await request.post(BASE_ROUTE).send({
                userId: userWithBooking1.id,
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
            const loginResponse = await loginUserWithBooking1(request);
            const response = await request
                .get(`${BASE_ROUTE}/${userWithBooking1.bookingNumber}`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                );

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    bookingNumber: userWithBooking1.bookingNumber,
                    trip: expect.objectContaining({
                        id: 1,
                        flightToMoon: expect.objectContaining({
                            seats: expect.arrayContaining([expect.any(String)]),
                        }),
                        flightToEarth: expect.objectContaining({
                            seats: expect.arrayContaining([expect.any(String)]),
                        }),
                    }),
                    user: expect.objectContaining({
                        id: userWithBooking1.id,
                        firstName: userWithBooking1.firstName,
                        lastName: userWithBooking1.lastName,
                        email: userWithBooking1.email,
                        role: expect.any(String),
                    }),
                    room: expect.objectContaining({
                        capacity: 1,
                    }),
                }),
            );
        });

        test(`GET ${BASE_ROUTE}/:bookingNumber Not Found`, async () => {
            const loginResponse = await loginUserWithBooking1(request);
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
            const loginResponse = await loginUserWithBooking1(request);

            const response = await request
                .get(`${BASE_ROUTE}/${userWithBooking2.bookingNumber}`)
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
                `${BASE_ROUTE}/${userWithBooking1.bookingNumber}`,
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
