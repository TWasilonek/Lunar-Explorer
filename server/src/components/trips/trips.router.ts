import express from "express";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { getTripById, getTrips } from "./trips.controller";

const router = express.Router();

// TODO: add pagination by dates
router.get(
    "/",
    asyncMiddleware(async (req, res, next) => {
        const trips = await getTrips({
            startDate: req.query.startDate,
            endDate: req.query.endDate,
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
