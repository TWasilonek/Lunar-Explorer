import supertest from "supertest";
import { TestDBContext } from "../../utils/testHelpers/TestDBContext";
import {
    loginUserWithBooking1,
    userWithBooking1,
} from "../../utils/testHelpers/testDBUsers";

const BASE_ROUTE = "/api/v1/users";

const context = new TestDBContext();

describe("Logged in user REST API", () => {
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

    describe(`GET ${BASE_ROUTE}/me`, () => {
        test(`GET ${BASE_ROUTE}/me Success`, async () => {
            const loginResponse = await loginUserWithBooking1(request);
            const response = await request
                .get(`${BASE_ROUTE}/me`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                );

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: userWithBooking1.id,
                    firstName: userWithBooking1.firstName,
                    lastName: userWithBooking1.lastName,
                    email: userWithBooking1.email,
                }),
            );
        });

        test(`GET ${BASE_ROUTE}/me Unauthorized`, async () => {
            const response = await request.get(`${BASE_ROUTE}/me`);
            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });

    describe(`GET ${BASE_ROUTE}/me/bookings`, () => {
        test(`GET ${BASE_ROUTE}/me/bookings Success`, async () => {
            const bookingInDB = await context.dataSource.query(
                `SELECT * FROM bookings WHERE "bookingNumber" = $1`,
                [userWithBooking1.bookingNumber],
            );

            const loginResponse = await loginUserWithBooking1(request);
            const response = await request
                .get(`${BASE_ROUTE}/me/bookings`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                );

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        bookingNumber: bookingInDB[0].bookingNumber,
                        numberOfGuests: bookingInDB[0].numberOfGuests,
                        guestNames: bookingInDB[0].guestNames,
                        trip: expect.any(Object),
                        room: expect.any(Object),
                    }),
                ]),
            );
        });

        test(`GET ${BASE_ROUTE}/me/bookings Unauthorized`, async () => {
            const response = await request.get(`${BASE_ROUTE}/me/bookings`);
            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });

    describe(`PUT ${BASE_ROUTE}/me`, () => {
        test(`PUT ${BASE_ROUTE}/me Success`, async () => {
            const loginResponse = await loginUserWithBooking1(request);
            const response = await request
                .put(`${BASE_ROUTE}/me`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                )
                .send({
                    firstName: "Mia2",
                    lastName: "Taylor2",
                    email: "mia.taylor2@email.com",
                });
            expect(response.status).toBe(200);

            const userInDB = await context.dataSource.query(
                `SELECT * FROM users WHERE id = $1`,
                [userWithBooking1.id],
            );
            expect(userInDB[0]).toEqual(
                expect.objectContaining({
                    firstName: "Mia2",
                    lastName: "Taylor2",
                    email: "mia.taylor2@email.com",
                }),
            );

            // cleanup the user to the original state
            await context.dataSource.query(
                `UPDATE users SET "firstName" = $1, "lastName" = $2, email = $3 WHERE id = $4`,
                [
                    userWithBooking1.firstName,
                    userWithBooking1.lastName,
                    userWithBooking1.email,
                    userWithBooking1.id,
                ],
            );
        });

        test(`PUT ${BASE_ROUTE}/me Unauthorized`, async () => {
            const response = await request.put(`${BASE_ROUTE}/me`);
            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });

    describe(`DELETE ${BASE_ROUTE}/me`, () => {
        test(`DELETE ${BASE_ROUTE}/me Success`, async () => {
            const loginResponse = await loginUserWithBooking1(request);
            const response = await request
                .delete(`${BASE_ROUTE}/me`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                );

            expect(response.status).toBe(200);

            const userInDB = await context.dataSource.query(
                `SELECT * FROM users WHERE id = $1`,
                [userWithBooking1.id],
            );
            expect(userInDB.length).toBe(0);

            // cleanup the user to the original state
            await context.cleanData();
            await context.seedData();
        });

        test(`DELETE ${BASE_ROUTE}/me Unauthorized`, async () => {
            const response = await request.delete(`${BASE_ROUTE}/me`);
            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });
});
