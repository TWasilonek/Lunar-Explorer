import express from "express";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { verifyToken } from "../../middleware/verifyToken";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { createBookingSchema } from "./bookings.schema";

const router = express.Router();

router.post(
    "/",
    [verifyToken, validateRequestBody(createBookingSchema)],
    asyncMiddleware(async (req, res, next) => {
        res.json({ message: "POST /bookings" });
    }),
);

export default router;
