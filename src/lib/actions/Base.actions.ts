'use server'
import { AuthResponse } from "@/types/Auth";
import { getAuthTokens } from "../token";
import axios from "axios";
const BASE_URL = process.env.BASE_URL;

export async function getDataAsync<T>(API_URL: string , message?: string, errors?: string[]): Promise<AuthResponse<T>> {
    try{
        const tokens = await getAuthTokens();
        const res = await axios.get<Promise<AuthResponse<T>>>(`${BASE_URL}/${API_URL}`, {
            headers: {
                Authorization: `Bearer ${tokens?.accessToken}`
            }
        })
        return res.data;
    }catch(e: any){
        return {
            success: false,
            message: e.response?.data?.message ?? message ?? 'Operation Failed',
            errors: e.response?.data?.errors ?? errors,
            data: e.response?.data?.data
        };
    }
}

export async function postDataAsync<T,X>(API_URL: string ,body: X, message?: string, errors?: string[]): Promise<AuthResponse<T>> {
    try{
        const tokens = await getAuthTokens();
        const res = await axios.post<Promise<AuthResponse<T>>>(`${BASE_URL}/${API_URL}`, body, {
            headers: {
                Authorization: `Bearer ${tokens?.accessToken}`
            }
        })
        return res.data;
    }catch(e: any){
        return {
            success: false,
            message: e.response?.data?.message ?? message ?? 'Operation Failed',
            errors: e.response?.data?.errors ?? errors,
            data: e.response?.data?.data
        };
    }
}