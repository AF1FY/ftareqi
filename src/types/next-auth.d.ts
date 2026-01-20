import { LoginUser } from "@/auth";
import NextAuth from "next-auth"
import { Role } from "./User";

declare module "next-auth" {
    interface User {
        id: string;
        role: Role[];
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        isRefreshTokenExpired: boolean
    }

    export interface Session {
        userId: User.userId;
        role: User.role;
        isRefreshTokenExpired: User.isRefreshTokenExpired;
        accessToken: User.accessToken;
        refreshToken: User.refreshToken;
    }
}