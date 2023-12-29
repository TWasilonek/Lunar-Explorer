import { HttpStatusCode } from "../../constants";
import { BaseError } from "../BaseError";

export class BadRequestError extends BaseError {
  constructor(description = "bad request") {
    super("BAD REQUEST", HttpStatusCode.BAD_REQUEST, description);
  }
}
