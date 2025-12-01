"use server"

import axios from "axios";
import { LoginSchemaType, RegisterSchemaAPIType, VerifyPhoneNumberSchemaType } from "../validators/auth.schema";
import { AuthResponse, LoginResponse } from "@/types/User";
import { getAuthTokens } from "../token";
const BASE_URL = process.env.BASE_URL;
//* Registration
export async function registerUser(user: RegisterSchemaAPIType): Promise<AuthResponse> {
    try {
        return await axios.post(`${BASE_URL}/api/auth/register`,user)
            .then(response => {
                return response.data;
            })
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Registration failed",
            errors: error.response?.data?.errors || [],
            data: {}
        };
    }
}
//* Verify phone number after Registration
export async function verifyUserRegistration(formData: VerifyPhoneNumberSchemaType): Promise<AuthResponse> {
    try {
        return await axios.post(`${BASE_URL}/api/auth/phone/verify`, formData)
            .then(response => {
                return response.data;
            })
    }
    catch (e: any) {
        return {
            success: false,
            message: e.response?.data?.message || "Verification failed",
            errors: e.response?.data?.errors || [],
            data: e.response?.data?.data
        };
    }
}
//* Resend otp
export async function resendOTP(phoneNumber:string): Promise<AuthResponse> {
    try {
        return await axios.post(`${BASE_URL}/api/auth/phone/resend-otp`, {phoneNumber})
            .then(response => {
                return response.data;
            })
    }
    catch (e: any) {
        return {
            success: false,
            message: e.response?.data?.message || "Verification failed",
            errors: e.response?.data?.errors || [],
            data: e.response?.data?.data
        };
    }
}
//* Login
export async function loginUser(credentials:LoginSchemaType): Promise<LoginResponse> {
    try {
        return await axios.post(`${BASE_URL}/api/auth/login`,credentials)
            .then(response => {
                return response.data;
            })
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Invalid credentials!",
            errors: error.response?.data?.errors || [],
            data: null
        };
    }
}
//* Sign out
export async function signOutUser(): Promise<AuthResponse> {
    try {
        const tokens = await getAuthTokens();
        return await axios.post(`${BASE_URL}/api/auth/logout`,{token: tokens.refreshToken})
            .then(response => {
                return response.data;
            })
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Operation failed",
            errors: error.response?.data?.errors || [],
            data: {}
        };
    }
}