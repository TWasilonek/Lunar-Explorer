import { NextFunction, Request, Response } from "express";
import { getUserRepository } from "../../repositories/userRepository";
import { HttpStatusCode } from "../../constants";

export const checkDuplicateUsernameOrEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await getUserRepository().findByEmail(req.body.email);
        if (user) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .send({ message: "Email is already in use." });
        }
        next();
    } catch (err) {
        console.error(err);
        return res
            .status(HttpStatusCode.INTERNAL_SERVER)
            .send({ message: err });
    }
};
