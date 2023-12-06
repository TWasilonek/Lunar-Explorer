import express from "express";
import { checkDuplicateUsernameOrEmail } from "../../middleware/verifySignup";
import { signin, signup } from "./auth.controller";
import asyncMiddleware from "../../middleware/asyncMiddleware";

const router = express.Router();

router.post(
    "/signup",
    [checkDuplicateUsernameOrEmail],
    asyncMiddleware(async (req, res, next) => {
        // TODO: verify body
        // Option A: Express Validator https://express-validator.github.io/docs/guides/getting-started
        // Option B: Joi https://joi.dev/api/?v=17.4.2
        // Option C: Pass validation to the controller
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
    asyncMiddleware(async (req, res, next) => {
        // TODO: verify body
        // Option A: Express Validator https://express-validator.github.io/docs/guides/getting-started
        // Option B: Joi https://joi.dev/api/?v=17.4.2
        // Option C: Pass validation to the controller
        // TODO: verify body
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
