import { HttpStatusCode } from "../../constants";
import { BaseError } from "../BaseError";

export class InternalServerError extends BaseError {
    constructor(description = "internal server error") {
        super(
            "INTERNAL SERVER ERROR",
            HttpStatusCode.INTERNAL_SERVER,
            description,
        );
    }
}
