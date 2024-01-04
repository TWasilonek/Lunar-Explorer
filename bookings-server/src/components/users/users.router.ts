import express from "express";
import {
    deleteUser,
    getAllUsers,
    getUser,
    getUserBookings,
    updateUser,
} from "./users.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { verifyPermissions } from "../../middleware/verifyPermissions";
import { HttpStatusCode, AdminPermissions } from "../../constants";
import asyncMiddleware from "../../middleware/asyncMiddleware/asyncMiddleware";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { updateUserSchema } from "./users.schema";

const router = express.Router();

router.get(
    "/me",
    [verifyToken],
    asyncMiddleware(async (req, res, next) => {
        const user = await getUser(req.body.userId);
        res.json(user);
    }),
);

router.get(
    "/me/bookings",
    [verifyToken],
    asyncMiddleware(async (req, res, next) => {
        const bookings = await getUserBookings(req.body.userId);
        res.json(bookings);
    }),
);

router.put(
    "/me",
    [validateRequestBody(updateUserSchema), verifyToken],
    asyncMiddleware(async (req, res, next) => {
        const user = await updateUser(req.body.userId, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        });
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
    [verifyToken, verifyPermissions([AdminPermissions.READ])],
    asyncMiddleware(async (req, res, next) => {
        const users = await getAllUsers();
        res.json(users);
    }),
);

router.get(
    "/:userId",
    [verifyToken, verifyPermissions([AdminPermissions.READ])],
    asyncMiddleware(async (req, res, next) => {
        const user = await getUser(req.params.userId);
        res.json(user);
    }),
);

router.put(
    "/:userId",
    [
        validateRequestBody(updateUserSchema),
        verifyToken,
        verifyPermissions([AdminPermissions.UPDATE]),
    ],
    asyncMiddleware(async (req, res, next) => {
        const user = await updateUser(req.params.userId, req.body);
        res.json(user);
    }),
);

router.delete(
    "/:userId",
    [verifyToken, verifyPermissions([AdminPermissions.DELETE])],
    asyncMiddleware(async (req, res, next) => {
        await deleteUser(req.params.userId);
        res.sendStatus(HttpStatusCode.OK);
    }),
);

export default router;
