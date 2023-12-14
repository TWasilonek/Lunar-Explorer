import joi from "joi";

export const createBookingSchema = joi.object({
    userId: joi.string().required(),
    tripId: joi.number().required(),
    // TODO: check if 'single' or 'double'
    roomType: joi.string().required(),
    numberOfGuests: joi.number().required(),
    // TODO: the items will be passed as JSON arrays so they will need to be deserialized before validating
    // guestNames: joi.array().items(joi.string()),
    // fligthToMoonSeats: joi.array().items(joi.string()),
    // fligthToEarthSeats: joi.array().items(joi.string()),
});
