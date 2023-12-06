# Lunar Explorer Server

This is the server for the Lunar Explorer app.

## REST API schema

## Setup

### Prerequisites

-   **Node.js**

### Run locally

1. Run `npm install`
2. Start the local database
3. Start the server - `$ npm run dev`

## Concepts

### Database

This project uses postgresql as the database. It uses the [TypeORM](https://typeorm.io/#/) ORM with the repository pattern.

### Auth

This project uses JWT for authentication.

### RBAC

There is a simple role based access control system in place. The roles are: `admin` and `user`. The roles are only verified for non-user facing endpoints. The user facing endpoints are protected by the authentication middleware.

### Request and data validation

-   [class-validator](https://www.npmjs.com/package/class-validator) is used for entity validation. Only a handful of most important checks are done on the model. Normal request-specific validation is done in the controller.
