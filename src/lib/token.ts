"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Tokens } from "@/types/Auth";

export async function getAuthTokens(): Promise<Tokens | null> {
    console.log('📢 Get Auth Token invoked --------------\n');
    const session = await getServerSession(authOptions);
    if(session?.isRefreshTokenExpired || !session?.accessToken)
        return null;
    return {accessToken: session?.accessToken , refreshToken: session?.refreshToken , userId: session?.userId , roles: session?.role , IsDriver: session.IsDriver === 'True'};
}