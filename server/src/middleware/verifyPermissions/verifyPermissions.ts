import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../repositories/userRepository";
import { rolesConfig } from "../../config/rolesConfig";
import { HttpStatusCode, Permissions } from "../../constants";

export const verifyPermissions =
    (permissions: Permissions[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.userId;
            const user = await userRepository.findById(userId);
            if (!user) {
                return res
                    .status(HttpStatusCode.NOT_FOUND)
                    .send({ message: "User not found" });
            }
            const userRoleConfig = rolesConfig.find(
                (r) => r.name === user.role,
            );
            if (!userRoleConfig) {
                return res
                    .status(HttpStatusCode.FORBIDDEN)
                    .send({ message: "Forbidden" });
            }

            if (
                permissions.some((p) => userRoleConfig.permissions.includes(p))
            ) {
                return next();
            } else {
                return res
                    .status(HttpStatusCode.FORBIDDEN)
                    .send({ message: "Forbidden" });
            }
        } catch (err) {
            console.error("User does not have sufficient permissions.", err);
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .send({ message: "Forbidden" });
        }
    };
