'use server'
import { AuthResponse } from "@/types/Auth";
import { getAuthTokens } from "../token";
import axios from "axios";
import { PaginatedData } from "@/types/Moderator";
const BASE_URL = process.env.BASE_URL;

export async function getDataAsync<T>(API_URL: string , id: string = '', message?: string, errors?: string[]): Promise<AuthResponse<T>> {
    try{
        const tokens = await getAuthTokens();
        const url = `${BASE_URL}/${API_URL}/${id}`
        const res = await axios.get<Promise<AuthResponse<T>>>(url, {
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

export async function getPaginatedDataAsync<T>(API_URL: string , id: string = '', message?: string, errors?: string[]): Promise<AuthResponse<PaginatedData<T>>> {
    try{
        const tokens = await getAuthTokens();
        const url = `${BASE_URL}/${API_URL}/${id}`
        const res = await axios.get<Promise<AuthResponse<PaginatedData<T>>>>(url, {
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

export async function deleteByIDAsync<T>(API_URL: string , id: string | number, message?: string, errors?: string[]): Promise<AuthResponse<T>> {
    try{
        const tokens = await getAuthTokens();
        const res = await axios.delete<Promise<AuthResponse<T>>>(`${BASE_URL}/${API_URL}/${id}`, {
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