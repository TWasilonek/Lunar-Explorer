import express from "express";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { verifyToken } from "../../middleware/verifyToken";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { createBookingSchema } from "./bookings.schema";
import { createBooking } from "./bookings.controller";
import { HttpStatusCode } from "../../constants";

const router = express.Router();

router.post(
    "/",
    [verifyToken, validateRequestBody(createBookingSchema)],
    asyncMiddleware(async (req, res, next) => {
        const booking = await createBooking({
            userId: req.body.userId,
            tripId: req.body.tripId,
            roomType: req.body.roomType,
            numberOfGuests: req.body.numberOfGuests,
            guestNames: req.body.guestNames,
        });

        if (booking) {
            res.send(booking);
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER).send({
                message: "Could not create booking",
            });
        }
    }),
);

export default router;
