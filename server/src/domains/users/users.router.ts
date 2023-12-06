import express from "express";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
} from "./users.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { verifyPermissions } from "../../middleware/verifyPermissions";
import { HttpStatusCode, Permissions } from "../../constants";
import asyncMiddleware from "../../middleware/asyncMiddleware/asyncMiddleware";

const router = express.Router();

router.get(
    "/me",
    [verifyToken],
    asyncMiddleware(async (req, res, next) => {
        const user = await getUserById(req.body.userId);
        res.json(user);
    }),
);

router.put(
    "/me",
    [verifyToken],
    asyncMiddleware(async (req, res, next) => {
        const user = await updateUser(req.body.userId, req.body);
        res.json(user);
    }),
);

router.delete(
    "/me",
    [verifyToken],
    asyncMiddleware(async (req, res, next) => {
        await deleteUser(req.body.userId);
        res.sendStatus(HttpStatusCode.OK);
    }),
);

router.get(
    "/",
    [verifyToken, verifyPermissions([Permissions.READ])],
    asyncMiddleware(async (req, res, next) => {
        const users = await getAllUsers();
        res.json(users);
    }),
);

router.get(
    "/:userId",
    [verifyToken, verifyPermissions([Permissions.READ])],
    asyncMiddleware(async (req, res, next) => {
        const user = await getUserById(req.params.userId);
        res.json(user);
    }),
);

router.put(
    "/:userId",
    [verifyToken, verifyPermissions([Permissions.UPDATE])],
    asyncMiddleware(async (req, res, next) => {
        const user = await updateUser(req.params.userId, req.body);
        res.json(user);
    }),
);

router.delete(
    "/:userId",
    [verifyToken, verifyPermissions([Permissions.DELETE])],
    asyncMiddleware(async (req, res, next) => {
        await deleteUser(req.params.userId);
        res.sendStatus(HttpStatusCode.OK);
    }),
);

export default router;
