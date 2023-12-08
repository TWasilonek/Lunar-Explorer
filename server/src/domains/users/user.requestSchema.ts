import joi from "joi";

export const updateUserSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
});
