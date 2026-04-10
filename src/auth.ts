import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { Tokens } from "./types/Auth";

const BASE_URL = process.env.BASE_URL;

async function refreshAccessToken(token: any) {
    try {
        console.log("------------- ⭐Refreshing Access Token⭐-------\n\n\n");
        const response = await fetch(`${BASE_URL}/api/auth/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token.refreshToken }),
        });
        // console.log("Response from refresh token : ", response);

        const { data } = await response.json();
        // console.log("Data from refresh token : ", data);

        if (!response.ok) {
            throw data;
        }
        const { exp }: { exp: number } = jwtDecode(data);

        return {
            ...token,
            accessToken: data,
            expiresIn: exp * 1000,
        };
    } catch (error) {
        console.error("------------❗Error refreshing access token❗---------\n\n\n", error);
        return {
            ...token,
            isRefreshTokenExpired: true,
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                accessToken: {},
                refreshToken: {},
            },
            authorize: async (tokens) => {
                console.log("-------------📢 NEXTAUTH AUTHORIZE STARTED\n\n\n\n");
                const { accessToken, refreshToken } = tokens as Tokens;
                const { exp, sub , role , IsDriver }: { exp: number, sub: string , role: string , IsDriver: boolean } = jwtDecode(accessToken);
                console.log('---------------- From JWT Decode --------------------');
                console.log("Is driver : ", IsDriver );
                return {
                    id: sub,
                    role,
                    IsDriver,
                    accessToken,
                    refreshToken,
                    expiresIn: exp * 1000,
                    isRefreshTokenExpired: false
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }: { token: any, user: User }) {
            console.log('-------------📢 JWT invoked --------------\n\n\n\n');
            if (user) {
                token.userId = user.id
                token.role = user.role
                token.IsDriver = user.IsDriver
                token.accessToken = user.accessToken
                token.refreshToken = user.refreshToken
                token.expiresIn = user.expiresIn
                token.isRefreshTokenExpired = user.isRefreshTokenExpired
            }
            console.log('Date.now() < token?.expiresIn : ', Date.now() < token?.expiresIn);
            console.log('Date.now() : ', Date.now());
            console.log('token?.expiresIn : ', token?.expiresIn);
            if (Date.now() < token?.expiresIn) {
                return token;
            }
            console.error("-------------❗ Access Token expired❗ ------------\n\n\n");
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            if (token) {
                session.userId = token.userId;
                session.role = token.role;
                session.IsDriver = token.IsDriver;
                session.isRefreshTokenExpired = token.isRefreshTokenExpired;
                session.refreshToken = token.refreshToken
                session.accessToken = token.accessToken;
            }
            console.log("--------------⭐ Session ⭐---------------\n", session);
            return session;
        },
    }
};