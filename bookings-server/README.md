# Lunar Explorer Server

This is the server for the Lunar Explorer app.

## REST API schema

## Setup

### Prerequisites

-   **Node.js** and **npm**
-   **PostgreSQL** installed locally

### Prepare the environment

1. Create a `.env` file in the root of the project. Use the `.env.example` file as a template.
2. Create a database in PostgreSQL. The name of the database should be the same as the one in the `.env` file. Ensure that the user has the correct permissions to access the database and all other values are in line with your local PostgreSQL setup.
3. Run `npm install` to install the dependencies.
4. Start the local database.
5. Run `npm run migrations:run` to run the migrations. This will create the tables in the database and seed them with initial data.

### Run locally

1. Start the local database
2. Start the server - `$ npm run dev`

## Deployment

### Database

Deploy the database to a server or a cloud service (ex. AWS RDS). Ensure that the database is accessible from the server where the app will be deployed.

### Server

The server can be deployed to any server or cloud service. Ensure that the database is accessible from the server. Remember to include the environment variables in the deployment (look at the `.env.example` file).

#### Example with AWS Elastic Beanstalk

1. Create a new Elastic Beanstalk application.
2. Create a new environment for the application.
3. **OPTIONAL** Create a new RDS database.
4. Upload the code to the environment.
    1. Create a zip file of the code. Ex.: `$ zip -r bookings-server.zip .` or `$ git archive --format=zip --output=bookings-server.zip HEAD:bookings-server/`
    2. Upload the zip file to the environment in the provided UI.
5. Set the environment variables in the environment configuration. Make sure they match the database configuration.
6. Deploy the application.

## Concepts

### Database

This project uses postgresql as the database. It uses the [TypeORM](https://typeorm.io/#/) ORM with the repository pattern.

### Auth

This project uses JWT for authentication.

### RBAC

There is a simple role based access control system in place. The roles are: `admin` and `user`. The roles are only verified for non-user facing endpoints. The user facing endpoints are protected by the authentication middleware.

### Request and data validation

-   [class-validator](https://www.npmjs.com/package/class-validator) is used for entity validation. Only a handful of most important checks are done on the model. Normal request-specific validation is done in the controller.
