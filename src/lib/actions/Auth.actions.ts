"use server"
import axios from "axios";
import { LoginSchemaType, RegisterSchemaAPIType, ResetPasswordSchemaType, VerifyOTPSchemaType } from "../validators/auth.schema";
import { AuthResponse, Tokens, VerifyOtpResponse } from "@/types/Auth";
import { getAuthTokens } from "../token";
import { postDataAsync } from "./Base.actions";
const BASE_URL = process.env.BASE_URL;
//* Registration
export async function registerUser(user: RegisterSchemaAPIType): Promise<AuthResponse<null>> {
    try {
        return await axios.post(`${BASE_URL}/api/Auth/register`, user)
            .then(response => {
                return response.data;
            })
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Registration failed",
            errors: error.response?.data?.errors || [],
        };
    }
}
//* Verify phone number after Registration
export async function verifyUserRegistration(formData: VerifyOTPSchemaType): Promise<AuthResponse<VerifyOtpResponse>> {
    try {
        return await axios.post(`${BASE_URL}/api/Auth/phone/verify`, formData)
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
export async function resendOTP(phoneNumber: string): Promise<AuthResponse<null>> {
    try {
        return await axios.post(`${BASE_URL}/api/Auth/phone/resend-otp`, { phoneNumber })
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
export async function loginUser(credentials: LoginSchemaType): Promise<AuthResponse<Tokens>> {
    try {
        return await axios.post(`${BASE_URL}/api/Auth/login`, credentials)
            .then(response => {
                return response.data;
            })
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Invalid credentials!",
            errors: error.response?.data?.errors || [],
        };
    }
}
//! Sign out
export async function signOutUser() {
    const tokens = await getAuthTokens();
    // try {
    //     return await axios.post(`${BASE_URL}/api/Auth/logout`, { token: tokens?.refreshToken })
    //         .then(response => {
    //             return response.data;
    //         })
    // } catch (error: any) {
    //     return {
    //         success: false,
    //         message: error.response?.data?.message || "Signing out failed",
    //         errors: error.response?.data?.errors || [],
    //     };
    // }
    return await postDataAsync<undefined, { token?: string }>('api/Auth/logout', { token: tokens?.refreshToken}, 'Signing out failed');
}
//* Request otp for resetting password
export async function requestOTPAsync(phoneNumber: string): Promise<AuthResponse<null>> {
    try {
        return await axios.post(`${BASE_URL}/api/Auth/password/reset/request-otp`, { phoneNumber })
            .then(response => {
                return response.data;
            })
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            errors: error.response?.data?.errors || ["Error occured, please try again latter."],
        };
    }
}
//* Verify otp to reset password
export async function verifyOtpToResetPasswordAsync(formData: VerifyOTPSchemaType): Promise<AuthResponse<VerifyOtpResponse>> {
    try {
        return await axios.post(`${BASE_URL}/api/Auth/password/reset/verify-otp`, formData)
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
//* Change Password - requires oldPassword check
export async function resetPassword(data: any): Promise<AuthResponse<null>> {
    try {

        if (data.newPassword === data.oldPassword) {
            return {
                success: false,
                message: "New password must be different from old password",
                errors: [],
            };
        }

        return await axios.post(`${BASE_URL}/api/Auth/password/reset`, data)
            .then(response => response.data)
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Reset password failed",
            errors: error.response?.data?.errors || [],
        };
    }
}
//* Reset Password
export async function resetPasswordAsync(formData: ResetPasswordSchemaType): Promise<AuthResponse<null>> {
    try {
        return await axios.post(`${BASE_URL}/api/Auth/password/reset`, formData)
            .then(response => {
                return response.data;
            })
    }
    catch (e: any) {
        return {
            success: false,
            message: e.response?.data?.message || "",
            errors: e.response?.data?.errors || ['Reset failed'],
            data: e.response?.data?.data
        };
    }
}