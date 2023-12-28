import { HttpStatusCode } from "../../constants";
import { BaseError } from "../BaseError";

export class UnauthorizedError extends BaseError {
    constructor(description = "Unauthorized") {
        super("UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED, description);
    }
}
