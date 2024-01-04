import supertest from "supertest";

const LOGIN_ROUTE = "/api/v1/auth/login";

export const userWithBooking1 = {
    id: "aea84ac4-62dd-4592-8759-aae7a064f6cf",
    firstName: "Mia",
    lastName: "Taylor",
    email: "mia.taylor@email.com",
    password: "test12345",
    bookingNumber: "012345",
};

export const userWithBooking2 = {
    id: "0d937c43-6ea5-40a8-9bda-0c0f0a7f8f2b",
    firstName: "Ava",
    lastName: "Martin",
    email: "ava.martin@email.com",
    password: "test12345",
    bookingNumber: "012346",
};

export const loginUserWithBooking1 = async (
    request: supertest.SuperTest<supertest.Test>,
) =>
    await request.post(LOGIN_ROUTE).send({
        email: userWithBooking1.email,
        password: userWithBooking1.password,
    });

export const loginUserWithBooking2 = async (
    request: supertest.SuperTest<supertest.Test>,
) =>
    await request.post(LOGIN_ROUTE).send({
        email: userWithBooking1.email,
        password: userWithBooking1.password,
    });
