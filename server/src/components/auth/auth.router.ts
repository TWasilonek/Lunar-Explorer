import express from "express";
import { checkDuplicateUsernameOrEmail } from "../../middleware/verifySignup";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { signin, signup } from "./auth.controller";
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
        const { user, accessToken, refreshToken } = await signin({
            email: req.body.email,
            password: req.body.password,
        });
        res.header("x-access-token", accessToken);
        // todo: put the refresh token in a cookie
        res.send(user);
    }),
);

router.post("/logout", (req, res) => {
    // TODO: do I need to clear the token from the client?
    res.send("logout");
});

export default router;
