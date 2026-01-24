"use server"
import axios from "axios";
import { getAuthTokens } from "@/lib/token";
import { AuthResponse } from "@/types/Auth";

const BASE_URL = process.env.BASE_URL;

//* Submit Driver Profile
export async function submitDriverProfile(formData: FormData): Promise<AuthResponse<null>> {
  try {
    const tokens = await getAuthTokens();
    const userID = tokens?.userId;
    if (!userID) {
      throw new Error("No valid user ID found");
    }
    const response = await axios.post(`${BASE_URL}/api/users/${userID}/driver-profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Driver profile submission failed",
      errors: error.response?.data?.errors || [],
    };
  }
}

//* Submit Car Details
export async function submitCarDetailsAsync(formData: FormData): Promise<AuthResponse<null>> {
  try {
    const tokens = await getAuthTokens();
    const userID = tokens?.userId;
    
    const response = await axios.post(`${BASE_URL}/api/users/${userID}/driver-profile/car`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Car details submission failed",
      errors: error.response?.data?.errors || [],
    };
  }
}