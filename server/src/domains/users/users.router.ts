import express, { NextFunction, Request, Response } from "express";
import { getAllUsers, getUserById } from "./users.controller";
import { verifyToken } from "../../middleware/verifyToken";

const router = express.Router();

router.get(
    "/me",
    [verifyToken],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await getUserById(req.body.userId);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/",
    [verifyToken],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    },
);

router.post("/", (eq: Request, res: Response, next: NextFunction) => {
    // implementation for creating a new user
});

router.put("/me", (eq: Request, res: Response, next: NextFunction) => {
    // implementation for updating user data
});

router.delete("/me", (eq: Request, res: Response, next: NextFunction) => {
    // implementation for deleting user data
});

export default router;
