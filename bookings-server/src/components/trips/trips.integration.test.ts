import supertest from "supertest";
import { TestDBContext } from "../../utils/testHelpers/TestDBContext";

const BASE_ROUTE = "/api/v1/trips";

const context = new TestDBContext();

describe("Trips REST API", () => {
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
    describe(`GET ${BASE_ROUTE}/`, () => {
        test(`GET ${BASE_ROUTE}/ Success (no query params)`, async () => {
            const response = await request.get(BASE_ROUTE);
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });

        test(`GET ${BASE_ROUTE}/ Success (with query params)`, async () => {
            const startDateParam = "2024-04-01";
            const endDateParam = "2024-05-01";
            const response = await request.get(BASE_ROUTE).query({
                startDate: startDateParam,
                endDate: endDateParam,
            });
            expect(response.status).toBe(200);
            expect(
                new Date(response.body[0].startDate).getTime(),
            ).toBeGreaterThanOrEqual(new Date(startDateParam).getTime());
            expect(
                new Date(
                    response.body[response.body.length - 1].startDate,
                ).getTime(),
            ).toBeLessThanOrEqual(new Date(endDateParam).getTime());
        });
    });

    describe(`GET ${BASE_ROUTE}/:id`, () => {
        test(`GET ${BASE_ROUTE}/:id Success`, async () => {
            const response = await request.get(`${BASE_ROUTE}/1`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: 1,
                    startDate: expect.any(String),
                    endDate: expect.any(String),
                }),
            );
        });

        test(`GET ${BASE_ROUTE}/:id Not Found (trip id wrong format)`, async () => {
            const response = await request.get(`${BASE_ROUTE}/not-a-trip-id`);
            expect(response.status).toBe(404);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "not found",
                }
            `);
        });

        test(`GET ${BASE_ROUTE}/:id Not Found (non existing trip id)`, async () => {
            const response = await request.get(`${BASE_ROUTE}/999`);
            expect(response.status).toBe(404);
            expect(response.body).toMatchInlineSnapshot(`
                {
                  "message": "Trip not found",
                }
            `);
        });
    });
});
