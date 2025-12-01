"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
export interface Tokens{
    accessToken: string,
    refreshToken: string,
}
export async function getAuthTokens(): Promise<Tokens> {
    console.log('📢 Get Auth Token invoked --------------\n');
    const session = await getServerSession(authOptions);
    return {accessToken: session?.accessToken , refreshToken: session?.refreshToken};
}