import { joi } from "../../utils/customJoi";

export const signupSchema = joi.object({
    firstName: joi.string().required().messages({
        "any.required": "First name is required",
    }),
    lastName: joi.string().required().messages({
        "any.required": "Last name is required",
    }),
    email: joi.string().email().required().messages({
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
    }),
    password: joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
    }),
});

export const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
    }),
    password: joi.string().min(8).required().messages({
        "string.min": "Wrong credentials",
        "any.required": "Password is required",
    }),
});
