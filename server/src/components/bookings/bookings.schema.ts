import { joi } from "../../utils/customJoi";

export const createBookingSchema = joi.object({
    userId: joi.string().required(),
    tripId: joi.number().required(),
    roomType: joi.any().valid("single", "double").required(),
    numberOfGuests: joi.number().required(),
    guestNames: joi.array().items(joi.string()),
    flightToMoon: joi
        .object({
            flightId: joi.string().required(),
            seats: joi.string().required(),
        })
        .required(),
    flightToEarth: joi
        .object({
            flightId: joi.string().required(),
            seats: joi.string().required(),
        })
        .required(),

    // flightToMoonSeats: joi.array().items(joi.string()).required(),
    // flightToEarthSeats: joi.array().items(joi.string()).required(),
});
