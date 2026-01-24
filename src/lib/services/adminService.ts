import { Role } from "@/types/User";
import { getAuthTokens } from "../token";

export async function getUserRoles() : Promise<Role[]> {
    const token = await getAuthTokens();
    const userRoles: Role[] = Array.isArray(token?.roles)
        ? (token.roles as Role[])
        : token?.roles
            ? [token.roles as Role]
            : [Role.User];
    return userRoles;
}