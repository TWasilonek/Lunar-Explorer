import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next?: NextFunction,
) => Promise<any>;

const asyncMiddleware = (handler: AsyncRequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export default asyncMiddleware;
