import supertest from "supertest";
import { createApp } from "../../app";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { getDataSource } from "../../db/dataSource";

const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "test12345",
};

describe("Auth integration", () => {
    const BASE_ROUTE = "/api/v1/auth";
    let request: supertest.SuperTest<supertest.Test>;

    beforeAll(async () => {
        // Start the test database
        const dbConfig: PostgresConnectionOptions = {
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "tomaszw",
            password: "",
            database: "lunar_explorer_test",
            synchronize: false, // the migrations will take care of this
            logging: false,
            entities: [process.env.PG_ENTITIES as unknown as string],
            migrations: [process.env.PG_MIGRATIONS as unknown as string],
        };
        const app = await createApp(dbConfig);

        // TODO: should you run the migrations or seed script? Ex. create the users table

        // Create a Supertest instance
        request = supertest(app);
    });

    afterAll(async () => {
        await getDataSource().query(
            `DELETE FROM users WHERE email='${user.email}';`,
        );
        // TODO: Should you delete the test database after all tests are done?
        await getDataSource().destroy();
    });

    describe(`POST ${BASE_ROUTE}/signup`, () => {
        afterEach(() => {
            getDataSource().query(
                `DELETE FROM users WHERE email='${user.email}';`,
            );
        });

        test(`POST ${BASE_ROUTE}/signup Success`, async () => {
            const response = await request
                .post(`${BASE_ROUTE}/signup`)
                .send(user);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: "user",
                }),
            );

            const dbResponse = await getDataSource().query(
                `SELECT * FROM users WHERE email='${user.email}';`,
            );
            expect(dbResponse).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: "user",
                        refreshToken: null,
                    }),
                ]),
            );
        });

        test(`POST ${BASE_ROUTE}/signup wrong email format`, async () => {
            const response = await request.post(`${BASE_ROUTE}/signup`).send({
                ...user,
                email: "WRONG EMAIL",
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": ""email" must be a valid email",
                }
            `);
        });

        test(`POST ${BASE_ROUTE}/signup wrong password format`, async () => {
            const response = await request.post(`${BASE_ROUTE}/signup`).send({
                ...user,
                password: "short",
            });

            expect(response.status).toBe(400);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": ""password" length must be at least 8 characters long",
                }
            `);
        });
    });

    describe(`POST ${BASE_ROUTE}/login`, () => {
        beforeAll(async () => {
            await request.post(`${BASE_ROUTE}/signup`).send(user);
        });

        afterAll(() => {
            getDataSource().query(
                `DELETE FROM users WHERE email='${user.email}';`,
            );
        });

        test(`POST ${BASE_ROUTE}/login Success`, async () => {
            const response = await request.post(`${BASE_ROUTE}/login`).send({
                email: user.email,
                password: user.password,
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: "user",
                }),
            );
            expect(response.header["x-access-token"]).toEqual(
                expect.any(String),
            );
            expect(response.header["set-cookie"]).toEqual(
                expect.arrayContaining([
                    expect.stringContaining("refreshToken"),
                ]),
            );

            const dbResponse = await getDataSource().query(
                `SELECT * FROM users WHERE email='${user.email}';`,
            );
            expect(dbResponse).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        refreshToken: expect.any(String),
                    }),
                ]),
            );
        });

        test(`POST ${BASE_ROUTE}/login wrong email format`, async () => {
            const response = await request
                .post(`${BASE_ROUTE}/login`)
                .send({ email: "WRONG EMAIL", password: user.password });

            expect(response.status).toBe(400);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": ""email" must be a valid email",
                }
            `);
        });

        test(`POST ${BASE_ROUTE}/login wrong credentials - email`, async () => {
            const response = await request
                .post(`${BASE_ROUTE}/login`)
                .send({ email: "NOT_john@doe.com", password: user.password });

            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });

        test(`POST ${BASE_ROUTE}/login wrong credentials - password`, async () => {
            const response = await request
                .post(`${BASE_ROUTE}/login`)
                .send({ email: user.email, password: "WRONG PASSWORD" });

            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });

    describe(`POST ${BASE_ROUTE}/logout`, () => {
        let loginResponse: supertest.Response;

        beforeAll(async () => {
            await request.post(`${BASE_ROUTE}/signup`).send(user);
        });
        afterAll(() => {
            getDataSource().query(
                `DELETE FROM users WHERE email='${user.email}';`,
            );
        });

        beforeEach(async () => {
            loginResponse = await request.post(`${BASE_ROUTE}/login`).send({
                email: user.email,
                password: user.password,
            });
        });

        test(`POST ${BASE_ROUTE}/logout Success`, async () => {
            const response = await request
                .post(`${BASE_ROUTE}/logout`)
                .set(
                    "Authorization",
                    `Bearer ${loginResponse.header["x-access-token"]}`,
                )
                .set("Cookie", loginResponse.header["set-cookie"]);

            expect(response.status).toBe(200);
            expect(response.header["set-cookie"]).toEqual(
                expect.arrayContaining([
                    expect.stringContaining("refreshToken=;"),
                ]),
            );

            const dbResponse = await getDataSource().query(
                `SELECT * FROM users WHERE email='${user.email}';`,
            );
            expect(dbResponse).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        refreshToken: null,
                    }),
                ]),
            );
        });

        test(`POST ${BASE_ROUTE}/logout no token`, async () => {
            const response = await request
                .post(`${BASE_ROUTE}/logout`)
                .set("Cookie", loginResponse.header["set-cookie"]);

            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });

    describe(`POST ${BASE_ROUTE}/refresh`, () => {
        let loginResponse: supertest.Response;

        beforeAll(async () => {
            await request.post(`${BASE_ROUTE}/signup`).send(user);
        });
        afterAll(() => {
            getDataSource().query(
                `DELETE FROM users WHERE email='${user.email}';`,
            );
        });

        beforeEach(async () => {
            loginResponse = await request.post(`${BASE_ROUTE}/login`).send({
                email: user.email,
                password: user.password,
            });
        });

        test(`POST ${BASE_ROUTE}/refresh Success`, async () => {
            // make sure the new refresh token will be created with a new timestamp to be different from the one from the login response
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = await request
                .post(`${BASE_ROUTE}/refresh`)
                .set("Cookie", loginResponse.header["set-cookie"]);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    accessToken: expect.any(String),
                }),
            );

            const newRefreshTokenCookie = response.header["set-cookie"].find(
                (cookie: string) => cookie.includes("refreshToken"),
            );
            expect(newRefreshTokenCookie).toEqual(expect.any(String));
            const newRefreshToken = newRefreshTokenCookie
                .split(";")[0]
                .split("=")[1];
            expect(newRefreshToken).toEqual(expect.any(String));

            const dbResponse = await getDataSource().query(
                `SELECT * FROM users WHERE email='${user.email}';`,
            );
            expect(dbResponse).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        refreshToken: expect.stringContaining(newRefreshToken),
                    }),
                ]),
            );
        });

        test(`POST ${BASE_ROUTE}/refresh no token`, async () => {
            const response = await request.post(`${BASE_ROUTE}/refresh`);

            expect(response.status).toBe(401);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Unauthorized",
                }
            `);
        });
    });
});
