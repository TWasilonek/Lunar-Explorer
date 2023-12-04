import { NextFunction, Request, Response } from "express";
import { usersRepository } from "../domains/users/users.repository";

export const checkDuplicateUsernameOrEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await usersRepository.findByEmail(req.body.email);
        if (user) {
            return res
                .status(400)
                .send({ message: "Email is already in use." });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: err });
    }
};
