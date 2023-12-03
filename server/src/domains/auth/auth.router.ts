import express, { NextFunction, Request, Response } from "express";
import { checkDuplicateUsernameOrEmail } from "../../middleware/verifySignup";
import { signin, signup } from "./auth.controller";

const router = express.Router();

router.post(
    "/signup",
    [checkDuplicateUsernameOrEmail],
    async (req: Request, res: Response, next: NextFunction) => {
        // TODO: verify body
        // Option A: Express Validator https://express-validator.github.io/docs/guides/getting-started
        // Option B: Joi https://joi.dev/api/?v=17.4.2
        // Option C: Pass validation to the controller
        try {
            const user = await signup({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            });
            res.send(user);
        } catch (err) {
            console.error(err);
            next(err);
        }
    },
);

router.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
        // TODO: verify body
        // Option A: Express Validator https://express-validator.github.io/docs/guides/getting-started
        // Option B: Joi https://joi.dev/api/?v=17.4.2
        // Option C: Pass validation to the controller
        try {
            // TODO: verify body
            const userWithAccessToken = await signin({
                email: req.body.email,
                password: req.body.password,
            });
            res.send(userWithAccessToken);
        } catch (err) {
            console.error(err);
            next(err);
        }
    },
);

router.post("/logout", (req, res) => {
    // TODO: do I need to clear the token from the client?
    res.send("logout");
});

export default router;
