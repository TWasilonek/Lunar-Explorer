import { HttpStatusCode } from "../../constants";

export class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode | number;

    constructor(name: string, httpCode: HttpStatusCode, description: string) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;

        Error.captureStackTrace(this);
    }
}
