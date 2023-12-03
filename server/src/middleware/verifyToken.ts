import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import authConfig from "../config/authConfig";

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
        return res.status(403).send({ message: "No token provided" });
    }

    if (!authConfig.secret) {
        console.error('There is no "secret"');
        return res
            .status(500)
            .send({ message: "Something went wront. Try again later." });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err || !decoded) {
            console.log(err);
            return res.status(401).send({ message: "Unauthorized" });
        }
        req.body.user = (decoded as JwtPayload).id;
        next();
    });
};
