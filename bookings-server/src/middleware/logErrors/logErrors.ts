import { NextFunction, Request, Response } from "express";
import { isProduction } from "../../utils/env";

const logErrors = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // log nothing if in production or if headers have already been sent
    if (isProduction() || res.headersSent) {
        next(error);
        return;
    }

    console.error(error);
    next(error);
};

export default logErrors;
