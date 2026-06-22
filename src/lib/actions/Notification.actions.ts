'use server'
import { AuthResponse } from "@/types/Auth";
import { PaginatedData } from "@/types/Moderator";
import { AllNotificationMetadata, AppNotification, BaseNotificationMetadata, NotificationCategory, WalletTransactionMetadata } from "@/types/Notifications";
import { getAuthTokens } from "../token";
import axios from "axios";
import { deleteByIDAsync, getDataAsync } from "./Base.actions";
const BASE_URL = process.env.BASE_URL;
const API_URL = 'api/Notification'

//? GET
export async function getNotificationsAsync(Page?: number, PageSize?: number, SortDescending?: 'true' | 'false'): Promise<AuthResponse<PaginatedData<AppNotification<AllNotificationMetadata>>>> {
    try {
        const tokens = await getAuthTokens();
        const res = await axios.get<AuthResponse<PaginatedData<AppNotification<AllNotificationMetadata>>>>(`${BASE_URL}/${API_URL}`, {
            params: {
                Page,
                PageSize,
                SortDescending
            },
            headers: {
                Authorization: `Bearer ${tokens?.accessToken}`
            }
        });
        if (res.data.success){
            return res.data;
        }
        throw new Error(res.data.message)
    } catch (e: any) {
        return {
            success: false,
            message: e.response?.data?.message ?? 'Operation Failed',
            errors: e.response?.data?.errors
        }
    }
}
export const getNotificationByIdAsync = async (id: number) => getDataAsync<AppNotification<string>, undefined>(API_URL, `${id}`, 'Failed to get notification');
export const getUnReadAsync = async () => getDataAsync<{count: number},undefined>(`${API_URL}/unread-count`);
//^ PUT
export async function markAsRead(all: boolean, id?: number): Promise<AuthResponse<undefined>> {
    try {
        const tokens = await getAuthTokens();
        const url = `${BASE_URL}/${API_URL}/${all ? 'mark-all-as-read' : `${id}/mark-as-read`}`;
        const res = await axios.put<AuthResponse<undefined>>(url, {}, {
            headers: {
                Authorization: `Bearer ${tokens?.accessToken}`
            }
        })
        if ((await res.data).success)
            return res.data;
        throw new Error((await res.data).message)
    } catch (e: any) {
        return {
            success: false,
            message: e.response?.data?.message ?? 'Operation Failed',
            errors: e.response?.data?.errors
        }
    }
}

//! DELETE
export const deleteNotificationByIdAsync = async (id: number) => deleteByIDAsync(API_URL, id, 'Failed to delete notification');