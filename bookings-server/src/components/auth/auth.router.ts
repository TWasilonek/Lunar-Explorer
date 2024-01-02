import express from "express";
import { checkDuplicateUsernameOrEmail } from "../../middleware/verifySignup";
import asyncMiddleware from "../../middleware/asyncMiddleware";
import { validateRequestBody } from "../../middleware/validateRequestBody";
import { logout, refreshTokens, signin, signup } from "./auth.controller";
import { loginSchema, signupSchema } from "./auth.requestSchema";
import { isProduction } from "../../utils/env";
import { verifyToken } from "../../middleware/verifyToken";

const setRefreshTokenCookie = (res: express.Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction(),
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};

const router = express.Router();

router.post(
    "/signup",
    [validateRequestBody(signupSchema), checkDuplicateUsernameOrEmail],
    asyncMiddleware(async (req, res) => {
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
    asyncMiddleware(async (req, res) => {
        const { user, accessToken, refreshToken } = await signin({
            email: req.body.email,
            password: req.body.password,
        });

        res.header("x-access-token", accessToken);
        setRefreshTokenCookie(res, refreshToken);
        res.send(user);
    }),
);

router.post(
    "/logout",
    [verifyToken],
    asyncMiddleware(async (req, res) => {
        await logout(req.body.userId);
        res.clearCookie("refreshToken");
        res.sendStatus(200);
    }),
);

router.post(
    "/refresh",
    asyncMiddleware(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await refreshTokens(refreshToken);

        setRefreshTokenCookie(res, newRefreshToken);
        res.send({ accessToken });
    }),
);

export default router;
