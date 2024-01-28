import { HttpStatusCode } from "../../constants";
import { BaseError } from "../BaseError";

export class NotFoundError extends BaseError {
    constructor(description = "not found") {
        super("NOT FOUND", HttpStatusCode.NOT_FOUND, description);
    }
}
