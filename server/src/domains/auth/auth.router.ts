import express from "express";
import { checkDuplicateUsernameOrEmail } from "../../middleware/verifySignup";
import { signin, signup } from "./auth.controller";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { loginSchema, signupSchema } from "./auth.requestSchema";

const router = express.Router();

router.post(
    "/signup",
    [validateRequestBody(signupSchema), checkDuplicateUsernameOrEmail],
    asyncMiddleware(async (req, res, next) => {
        const user = await signup({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });
        res.send(user);
    }),
);

router.post(
    "/login",
    [validateRequestBody(loginSchema)],
    asyncMiddleware(async (req, res, next) => {
        const userWithAccessToken = await signin({
            email: req.body.email,
            password: req.body.password,
        });
        res.send(userWithAccessToken);
    }),
);

router.post("/logout", (req, res) => {
    // TODO: do I need to clear the token from the client?
    res.send("logout");
});

export default router;
