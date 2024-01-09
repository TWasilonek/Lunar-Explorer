import { AdminPermissions, UserRole } from "../types";

export type RoleConfig = {
    name: UserRole;
    permissions: AdminPermissions[];
};

export const rolesConfig: RoleConfig[] = [
    {
        name: UserRole.ADMIN,
        permissions: [
            AdminPermissions.READ,
            AdminPermissions.CREATE,
            AdminPermissions.UPDATE,
            AdminPermissions.DELETE,
        ],
    },
    {
        name: UserRole.USER,
        permissions: [],
    },
];
