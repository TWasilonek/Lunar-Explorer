import { RoomType } from "../../types";
import { joi } from "../../utils/customJoi";

export const createBookingSchema = joi.object({
    userId: joi.string().required(),
    tripId: joi.number().required(),
    roomType: joi.any().valid(RoomType.SINGLE, RoomType.DOUBLE).required(),
    numberOfGuests: joi.number().min(1).max(2).required(),
    guestNames: joi
        .array()
        .items(joi.string())
        .length(joi.ref("numberOfGuests"))
        .message("guestNames length must be equal to numberOfGuests")
        .required(),
});
