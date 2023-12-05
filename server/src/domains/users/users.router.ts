import express, { NextFunction, Request, Response } from "express";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
} from "./users.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { verifyPermissions } from "../../middleware/verifyPermissions";
import { Permissions } from "../../constants";

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

router.put(
    "/me",
    [verifyToken],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await updateUser(req.body.userId, req.body);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    "/me",
    [verifyToken],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteUser(req.body.userId);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/",
    [verifyToken, verifyPermissions([Permissions.READ])],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/:userId",
    [verifyToken, verifyPermissions([Permissions.READ])],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await getUserById(req.params.userId);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.put(
    "/:userId",
    [verifyToken, verifyPermissions([Permissions.UPDATE])],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await updateUser(req.params.userId, req.body);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    "/:userId",
    [verifyToken, verifyPermissions([Permissions.DELETE])],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteUser(req.params.userId);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    },
);

export default router;
