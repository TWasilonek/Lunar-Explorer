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

        // Create a Supertest instance
        request = supertest(app);
    });

    afterAll(async () => {
        // TODO: Stop the test database?
    });

    afterEach(() => {
        getDataSource().query(`DELETE FROM users WHERE email='${user.email}';`);
    });

    describe(`POST ${BASE_ROUTE}/signup`, () => {
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

    describe.only(`POST ${BASE_ROUTE}/login`, () => {
        test(`POST ${BASE_ROUTE}/login Success`, async () => {
            await request.post(`${BASE_ROUTE}/signup`).send(user);

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
            await request.post(`${BASE_ROUTE}/signup`).send(user);

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
            await request.post(`${BASE_ROUTE}/signup`).send(user);

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
            await request.post(`${BASE_ROUTE}/signup`).send(user);

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

    // TODO: Logout

    // TODO: Refresh

    // test(`POST ${BASE_ROUTE}/logout`, async () => {
    //     // TODO: Write the test for the /logout route using Supertest
    //     const response = await request.post("/logout");
    //     // Assert the response
    //     expect(response.status).toBe(200);
    //     // TODO: Add more assertions as needed
    // });

    // test(`POST ${BASE_ROUTE}/refresh`, async () => {
    //     // TODO: Write the test for the /refresh route using Supertest
    //     const response = await request.post("/refresh");
    //     // Assert the response
    //     expect(response.status).toBe(200);
    //     // TODO: Add more assertions as needed
    // });
});
