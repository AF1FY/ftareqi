import { LoginUser } from "@/auth";
import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        isRefreshTokenExpired: boolean
    }

    export interface Session {
        isRefreshTokenExpired: User.isRefreshTokenExpired;
        accessToken: User.accessToken;
        refreshToken: User.refreshToken;
    }
}