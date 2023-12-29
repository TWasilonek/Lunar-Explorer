import { NextFunction, Request, Response } from "express";
import { isProduction } from "../../utils/env";
import { BadRequestError } from "../../errors/BadRequestError/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { InternalServerError } from "../../errors/InternalServerError";
import { HttpStatusCode } from "../../constants";

const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof InternalServerError
    ) {
        res.status(error.httpCode);
        res.json({ message: error.message });
        return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER);
    res.json({
        message: error.message,
        // we only add a `stack` property in non-production environments
        ...(isProduction() ? null : { stack: error.stack }),
    });
};

export default errorHandler;
