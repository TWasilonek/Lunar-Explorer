import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationError } from "joi";
import { HttpStatusCode } from "../constants";

export const validateRequestBody = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error: unknown) {
            res.status(HttpStatusCode.BAD_REQUEST).send({
                message: (error as ValidationError).message,
            });
        }
    };
};
