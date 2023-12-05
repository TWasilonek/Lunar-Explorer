import { Permissions, UserRole } from "../constants";

export type RoleConfig = {
    name: UserRole;
    permissions: Permissions[];
};

export const rolesConfig: RoleConfig[] = [
    {
        name: UserRole.ADMIN,
        permissions: [
            Permissions.READ,
            Permissions.CREATE,
            Permissions.UPDATE,
            Permissions.DELETE,
        ],
    },
    {
        name: UserRole.USER,
        permissions: [],
    },
];
