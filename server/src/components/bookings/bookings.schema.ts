import { joi } from "../../utils/customJoi";

export const createBookingSchema = joi.object({
    userId: joi.string().required(),
    tripId: joi.number().required(),
    roomType: joi.any().valid("single", "double").required(),
    numberOfGuests: joi.number().required(),
    guestNames: joi.array().items(joi.string()),
    flightToMoonSeats: joi.array().items(joi.string()),
    flightToEarthSeats: joi.array().items(joi.string()),
});
