import { joi } from "../../utils/customJoi";

export const signupSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
});
