import { NextFunction, Request, Response } from "express";
import { usersRepository } from "../domains/users/users.repository";
import { rolesConfig } from "../config/rolesConfig";
import { Permissions } from "../constants";

export const verifyPermissions =
    (permission: Permissions[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.userId;
            const user = await usersRepository.findById(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const userRoleConfig = rolesConfig.find(
                (r) => r.name === user.role,
            );
            if (!userRoleConfig) {
                return res.status(403).send({ message: "Forbidden" });
            }

            if (
                permission.some((p) => userRoleConfig.permissions.includes(p))
            ) {
                return next();
            } else {
                return res.status(403).send({ message: "Forbidden" });
            }
        } catch (err) {
            console.error("User does not have sufficient permissions.", err);
            return res.status(403).send({ message: "Forbidden" });
        }
    };
