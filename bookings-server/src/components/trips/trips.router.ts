import express from "express";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { getTripById, getTrips } from "./trips.controller";

const router = express.Router();

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        const trips = await getTrips({
            startDate: req.query?.startDate as string,
            endDate: req.query?.endDate as string,
        });
        res.json(trips);
    }),
);

router.get(
    "/:id",
    asyncMiddleware(async (req, res) => {
        const tripIdAsNumber = parseInt(req.params.id, 10);
        if (isNaN(tripIdAsNumber)) {
            return res.status(404).json({ message: "not found" });
        }
        const trip = await getTripById(tripIdAsNumber);
        res.json(trip);
    }),
);

export default router;
