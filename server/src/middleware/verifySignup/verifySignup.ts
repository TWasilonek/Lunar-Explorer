import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../models/user/UserRepository";
import { HttpStatusCode } from "../../constants";

export const checkDuplicateUsernameOrEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await userRepository.findByEmail(req.body.email);
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
