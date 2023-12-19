import express from "express";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { verifyToken } from "../../middleware/verifyToken";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { createBookingSchema } from "./bookings.schema";
import { createBooking } from "./bookings.controller";

const router = express.Router();

router.post(
    "/",
    [verifyToken, validateRequestBody(createBookingSchema)],
    asyncMiddleware(async (req, res, next) => {
        // const booking = await createBooking({
        //     userId: req.body.userId,
        //     tripId: req.body.tripId,
        //     roomType: req.body.roomType,
        //     numberOfGuests: req.body.numberOfGuests,
        //     guestNames: req.body.guestNames,
        //     flightToMoonSeats: req.body.flightToMoonSeats,
        //     flightToEarthSeats: req.body.flightToEarthSeats,
        // });
        // res.json(booking);
        res.json({ message: "POST /bookings" });
    }),
);

export default router;
