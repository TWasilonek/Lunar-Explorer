import { HttpStatusCode } from "../../constants";
import { BaseError } from "../BaseError";

export class ForbiddenError extends BaseError {
    constructor(description = "Forbidden") {
        super("FORBIDDEN", HttpStatusCode.FORBIDDEN, description);
    }
}
