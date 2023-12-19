import { joi } from "../../utils/customJoi";

export const updateUserSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
});
