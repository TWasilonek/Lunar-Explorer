import express from "express";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { verifyToken } from "../../middleware/verifyToken";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { createBookingSchema } from "./bookings.schema";
import { createBooking, getBooking } from "./bookings.controller";
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

router.get(
    "/:bookingNumber",
    [verifyToken],
    asyncMiddleware(async (req, res, next) => {
        // if user is not booking owner return 403

        const booking = await getBooking(req.params.bookingNumber);
        if (booking.user.id !== req.body.userId) {
            console.error(
                `User ${req.body.userId} tried to access booking ${req.params.bookingNumber} owned by ${booking.user.id}`,
            );
            res.status(HttpStatusCode.FORBIDDEN).send({
                message: "Forbidden",
            });
            return;
        }

        if (booking) {
            res.send(booking);
        } else {
            res.status(HttpStatusCode.NOT_FOUND).send({
                message: "Booking not found",
            });
        }
    }),
);

export default router;
