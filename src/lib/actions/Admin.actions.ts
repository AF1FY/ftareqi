'use server'

import { IGetUsers, IUsersParams } from "@/types/User";
import { getAuthTokens } from "../token";
import axios from "axios";
import { PaginatedData } from "@/types/Moderator";
import { AuthResponse } from "@/types/Auth";

const BASE_URL = process.env.BASE_URL;
const BASE_ENDPOINT = 'api/admin/users';

export async function getUsersAsync(params: IUsersParams): Promise<AuthResponse<PaginatedData<IGetUsers>>> {
    try {
        const token = await getAuthTokens();

        // خطوة احترافية: تنظيف الباراميترز
        // نقوم بإنشاء object جديد يحتوي فقط على القيم التي ليست فارغة ولا null ولا undefined
        // هذا يمنع إرسال { PhoneNumber: '' } إلى الباك إند
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== '' && value != null)
        );

        // التغيير هنا: استخدام get بدلاً من post
        const res = await axios.get<AuthResponse<PaginatedData<IGetUsers>>>(`${BASE_URL}/${BASE_ENDPOINT}`, {
            // نستخدم cleanParams بدلاً من params المباشرة
            params: cleanParams,
            headers: {
                Authorization: `Bearer ${token?.accessToken}`
            }
        });

        return res.data;
    } catch (e: any) {
        console.error("API Error:", e); // مفيد للـ debugging
        return {
            success: false,
            message: e.response?.data?.message ?? 'Failed to fetch users.',
            errors: e.response?.data?.errors ?? ['Network error'],
            data: e.response?.data?.data
        };
    }
}