'use server'

import { IGetUsers, IUserDetails, IUsersParams, Role } from "@/types/User";
import { getAuthTokens } from "../token";
import axios from "axios";
import { PaginatedData } from "@/types/Moderator";
import { AuthResponse } from "@/types/Auth";

const BASE_URL = process.env.BASE_URL;
const BASE_ENDPOINT = 'api/admin/users';

export async function getUsersAsync(params: IUsersParams): Promise<AuthResponse<PaginatedData<IGetUsers>>> {
    try {
        const token = await getAuthTokens();

        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== '' && value != null)
        );

        const res = await axios.get<AuthResponse<PaginatedData<IGetUsers>>>(`${BASE_URL}/${BASE_ENDPOINT}`, {
            params: cleanParams,
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        });

        return res.data;
    } catch (e: any) {
        console.error("API Error:", e);
        return {
            success: false,
            message: e.response?.data?.message ?? 'Failed to fetch users.',
            errors: e.response?.data?.errors ?? ['Network error'],
            data: e.response?.data?.data
        };
    }
}
export async function getUserDetailsAsync(id:string) : Promise<AuthResponse<IUserDetails>> {
    try{
        const token = await getAuthTokens();
        return axios.get<AuthResponse<IUserDetails>>(`${BASE_URL}/${BASE_ENDPOINT}/${id}` , {
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        }).then(res => res.data);
    }catch(e:any){
        console.error('Error from getUserDetails : ',e);
        return{
            success: false,
            message: e.response?.data?.message ?? 'Failed to fetch user.',
            errors: e.response?.data?.errors ?? ['Network error'],
            data: e.response?.data?.data
        }
    }
}
//! Remove role
export async function removeRoleAsync(id:string , role: Role) : Promise<AuthResponse<undefined>> {
    try{
        const token = await getAuthTokens();
        return await axios.delete<AuthResponse<undefined>>(`${BASE_URL}/${BASE_ENDPOINT}/${id}/remove-role/${role.toLocaleLowerCase()}` , {
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        }).then(res => res.data);
    }catch(e:any){
        console.error('Error from removeRoleAsync : ',e);
        return{
            success: false,
            message: e.response?.data?.message ?? 'Failed to remove role from user.',
            errors: e.response?.data?.errors ?? ['Network error'],
            data: e.response?.data?.data
        }
    }
}
//* Add role
export async function addRoleAsync(id:string , role: Role) : Promise<AuthResponse<undefined>> {
    try{
        const token = await getAuthTokens();
        return await axios.post<AuthResponse<undefined>>(`${BASE_URL}/${BASE_ENDPOINT}/${id}/add-role/${role.toLocaleLowerCase()}` ,{}, {
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        }).then(res => res.data);
    }catch(e:any){
        console.error('Error from removeRoleAsync : ',e);
        return{
            success: false,
            message: e.response?.data?.message ?? 'Failed to add role to user.',
            errors: e.response?.data?.errors ?? ['Network error'],
            data: e.response?.data?.data
        }
    }
}