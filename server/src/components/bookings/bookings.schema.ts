import { CustomHelpers } from "joi";
import { RoomType } from "../../constants";
import { joi } from "../../utils/customJoi";
import { CreateBooking } from "../../types";

export const createBookingSchema = joi
    .object({
        userId: joi.string().required(),
        tripId: joi.number().required(),
        roomType: joi.any().valid(RoomType.SINGLE, RoomType.DOUBLE).required(),
        numberOfGuests: joi.number().min(1).max(2).required(),
        guestNames: joi.array().items(joi.string()),
    })
    .custom((value: CreateBooking, helpers: CustomHelpers) => {
        const { numberOfGuests, guestNames } = value;
        console.log("numberOfGuests", numberOfGuests);
        console.log("guestNames", guestNames);

        if (numberOfGuests !== guestNames.length) {
            // TODO: this is not working
            console.log("will error out");
            return {
                errors: [
                    helpers.error("any.invalid", {
                        message:
                            "guestNames length must be equal to numberOfGuests",
                    }),
                ],
            };
        }

        return { value };
    });
