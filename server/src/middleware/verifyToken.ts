import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import authConfig from "../config/authConfig";
import { HttpStatusCode } from "../constants";

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split("Bearer ")[1];
    }

    if (!token) {
        console.error("No token provided");
        return res
            .status(HttpStatusCode.FORBIDDEN)
            .send({ message: "Forbidden" });
    }

    if (!authConfig.secret) {
        console.error('There is no "secret"');
        return res
            .status(HttpStatusCode.INTERNAL_SERVER)
            .send({ message: "Something went wrong. Try again later." });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err || !decoded) {
            console.log(err);
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .send({ message: "Unauthorized" });
        }
        req.body.userId = (decoded as JwtPayload).id;
        next();
    });
};
