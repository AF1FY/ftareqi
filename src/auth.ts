import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.BASE_URL;

async function refreshAccessToken(token: any) {
    try {
        console.log("------------- ⭐Refreshing Access Token⭐-------");
        const response = await fetch(`${BASE_URL}/api/auth/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token.refreshToken }),
        });

        const { data } = await response.json();
        console.log("Data from refresh token : ", data);

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
        console.error("------------❗Error refreshing access token❗---------", error);
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
                phoneNumber: {},
                password: {},
            },

            authorize: async (credentials) => {
                console.log("-------------📢 NEXTAUTH AUTHORIZE STARTED");
                try {
                    const res = await fetch(`https://45e04bd41ad8.ngrok-free.app/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            phoneNumber: credentials?.phoneNumber,
                            password: credentials?.password
                        }),
                    });
                    const { data } = await res.json();
                    if (res.ok && data) {
                        const { accessToken, refreshToken } = data;
                        const { exp, sub }: { email: string; exp: number; sub: string } = jwtDecode(accessToken);
                        return {
                            id: sub,
                            accessToken,
                            refreshToken,
                            expiresIn: exp * 1000,
                            isRefreshTokenExpired: false
                        }
                    }
                    return null;
                } catch (e) {
                    throw new Error("Error occured");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: User }) {
            console.log('-------------📢 JWT invoked --------------');
            if (user) {
                token.accessToken = user.accessToken
                token.refreshToken = user.refreshToken
                token.expiresIn = user.expiresIn
                token.isRefreshTokenExpired = user.isRefreshTokenExpired
                console.log("--------------⭐ Token ⭐---------------", token);
                // return token;
            }
            console.log('Date.now() < token?.expiresIn : ', Date.now() < token?.expiresIn);
            console.log('Date.now() : ', Date.now());
            console.log('token?.expiresIn : ', token?.expiresIn);
            if (Date.now() < token?.expiresIn) {
                return token;
            }
            console.error("-------------❗ Access Token expired❗ ------------");
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            if (token) {
                session.isRefreshTokenExpired = token.isRefreshTokenExpired;
                session.accessToken = token.accessToken;
            }
            console.log("--------------⭐ Session ⭐---------------", session);
            return session;
        },
    }
};