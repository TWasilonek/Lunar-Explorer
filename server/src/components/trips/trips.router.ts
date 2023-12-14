import express from "express";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { getTripById, getTrips } from "./trips.controller";

const router = express.Router();

router.get(
    "/",
    asyncMiddleware(async (req, res, next) => {
        const trips = await getTrips({
            startDate: req.query?.startDate as string,
            endDate: req.query?.endDate as string,
        });
        res.json(trips);
    }),
);

router.get(
    "/:id",
    asyncMiddleware(async (req, res, next) => {
        const trip = await getTripById(req.params.id);
        res.json(trip);
    }),
);

export default router;
