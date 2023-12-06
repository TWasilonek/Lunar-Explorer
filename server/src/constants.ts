export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

export enum Permissions {
    READ = "read",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
}

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}
