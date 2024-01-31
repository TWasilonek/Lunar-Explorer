# Lunar Explorer Server

This is the server for the Lunar Explorer app.

## Setup

### Prerequisites

-   **Node.js** and **npm** (the project has been tested on Node.js v20.10.0 and npm v10.2.3)
-   **PostgreSQL** installed locally

### Prepare the environment

1. Create a `.env` file in the root of the project. Use the `.env.example` file as a template.
2. Create a database in PostgreSQL. The name of the database should be the same as the one in the `.env` file. Ensure that the user has the correct permissions to access the database and all other values are in line with your local PostgreSQL setup.
3. Run `npm install` to install the dependencies.
4. Start the local database.
5. Run `npm run migrations:run` to run the migrations. This will create the tables in the database and seed them with initial data.

### Run locally

1. Start the local database
2. Start the server - `npm run dev`

### Run tests

1. Create a test database in PostgreSQL. The name of the database should be the same as the one in the `PG_TEST_DATABASE` env veriable.
2. Set the `PG_TEST_DATABASE` and `PG_TEST_HOST` env variables to the correct values.
3. Run `npm run test` to run the tests.

## Deployment

### Database

Deploy the database to a server or a cloud service (ex. AWS RDS). Ensure that the database is accessible from the server where the app will be deployed.

### Server

The server can be deployed to any server or cloud service. Ensure that the database is accessible from the server. Remember to include the environment variables in the deployment (look at the `.env.example` file).

You can deploy a docker image to a cloud service (ex. AWS ES2) or run it on a server.
The **Dockerfile** is located in the root of the project.

## Stack

### Database

This project uses postgresql as the database. It uses the [TypeORM](https://typeorm.io/#/) ORM with the repository pattern.

### Auth

This project uses JWT for authentication.

### RBAC

There is a simple role based access control system in place. The roles are: `admin` and `user`. The roles are only verified for non-user facing endpoints. The user facing endpoints are protected by the authentication middleware.

### Request and data validation

[class-validator](https://www.npmjs.com/package/class-validator) is used for entity validation. Only a handful of most important checks are done on the model. Normal request-specific validation is done in the controller.
