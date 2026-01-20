"use server"

import { AuthResponse, Tokens } from '@/types/Auth';
import { DriverProfileDetails, DriverRequestItem, GetDriversParams, PaginatedData } from '@/types/Moderator';
import axios from 'axios';
import { getAuthTokens } from '../token';
const BASE_URL = process.env.BASE_URL;

//* Pending Driver Registrations
export const getPendingDriversAsync = async (params: GetDriversParams): Promise<AuthResponse<PaginatedData<DriverRequestItem>>> => {
    const token = await getAuthTokens();
    try {
        const response = await axios.get<AuthResponse<PaginatedData<DriverRequestItem>>>(`${BASE_URL}/api/moderator/driver-requests/pending`, {
            params,
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        });
        return response.data;
    } catch (e: any) {
        return {
            success: false,
            message: e.response?.data?.message || "Failed to display data",
            errors: e.response?.data?.errors || ['Reset failed'],
            data: e.response?.data?.data
        };
    }

};
export async function getDriverByIdAsync(id: number): Promise<AuthResponse<DriverProfileDetails>> {
    const token = await getAuthTokens();
    try {
        return await axios.get(`${BASE_URL}/api/moderator/driver-requests/${id}`,{
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        })
        .then(res => res.data);
    } catch (e: any) {
        return {
            success: false,
            message: e.response?.data?.message ?? "Operation failed",
            errors: e.response?.data?.errors ?? [],
        }
    }
}
//* Approve
export async function approveDriverAsync(driverId:number , isApproved: boolean) : Promise<AuthResponse<undefined>> {
    try{
        const token = await getAuthTokens();
        const status = isApproved ? 'approve' : 'reject';
        const url = `'${BASE_URL}api/moderator/driver-requests/${driverId}/${status}'`
        console.log('URL ===== : ',url)
        const response = await axios.post<AuthResponse<undefined>>(`${BASE_URL}/api/moderator/driver-requests/${driverId}/${status}`, {}, {
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        });
        return response.data;
    }catch(e: any){
        return{
            success: false,
            message: e.response?.data?.message ?? "Operation Failed",
            errors: e.response?.data?.errors ?? []
        }
    }
}