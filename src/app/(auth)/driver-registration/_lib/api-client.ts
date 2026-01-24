import axios from "axios";

// Update this URL every time you restart ngrok (copy the new forwarding HTTPS URL)
const BASE_URL = "https://polymorphonuclear-willetta-inflexible.ngrok-free.dev";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  driverId?: string;
  errors?: Record<string, string[]>;
  status?: number;
  rawData?: any;
}

export async function uploadDriverInfo(formData: FormData, userId: string): Promise<ApiResponse> {
  try {
    if (!BASE_URL) {
      return { success: false, message: "API base URL is not configured" };
    }

    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    // Debug: Log everything being sent
    console.log("Uploading driver info to:", `${BASE_URL}/api/users/${userId}/driver-profile`);
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`→ ${key}: ${value.name} (${value.size} bytes, type: ${value.type})`);
      } else {
        console.log(`→ ${key}: ${value}`);
      }
    }

    const response = await axios.post(`${BASE_URL}/api/users/${userId}/driver-profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "69420", // Bypasses ngrok free browser warning page
      },
    });

    return {
      success: true,
      message: response.data.message || "Driver information uploaded successfully",
      driverId: response.data.driverId || userId,
      data: response.data,
    };
  } catch (error: any) {
    console.error("───── uploadDriverInfo failed ─────");

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      console.log("Status Code:", status);
      console.log("Response Data:", JSON.stringify(responseData, null, 2));
      console.log("Error Message:", error.message);
      console.log("Request URL:", error.config?.url);
      console.log("───── End ─────");

      let userMessage = "An error occurred while connecting to the server";

      if (status === 400 || status === 422) {
        userMessage = responseData?.message || "Validation failed ";
      } else if (status === 404) {
        userMessage = "Endpoint not found ";
      } else if (status === 413) {
        userMessage = "File too large ";
      } else if (status === 500) {
        userMessage = "Server internal error";
      } else if (!status) {
        userMessage = "Network error ";
      }

      return {
        success: false,
        message: userMessage,
        errors: responseData?.errors ?? responseData ?? {},
        status,
        rawData: responseData,
      };
    }

    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "Connection failed",
      errors: {},
    };
  }
}

export async function uploadCarDetails(formData: FormData, userId: string): Promise<ApiResponse> {
  try {
    if (!BASE_URL) {
      return { success: false, message: "API base URL is not configured" };
    }

    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    console.log("Uploading car details to:", `${BASE_URL}/api/users/${userId}/driver-profile/car`);
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`→ ${key}: ${value.name} (${value.size} bytes, type: ${value.type})`);
      } else {
        console.log(`→ ${key}: ${value}`);
      }
    }

    const response = await axios.post(`${BASE_URL}/api/users/${userId}/driver-profile/car`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "69420", // Bypasses ngrok free browser warning page
      },
    });

    return {
      success: true,
      message: response.data.message || "Car details uploaded successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("───── uploadCarDetails failed ─────");

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      console.log("Status Code:", status);
      console.log("Response Data:", JSON.stringify(responseData, null, 2));
      console.log("Error Message:", error.message);
      console.log("Request URL:", error.config?.url);
      console.log("───── End ─────");

      let userMessage = "An error occurred while connecting to the server";

      if (status === 400 || status === 422) {
        userMessage = responseData?.message || "Validation failed ";
      } else if (status === 404) {
        userMessage = "Endpoint not found ";
      } else if (status === 413) {
        userMessage = "File too large ";
      } else if (status === 500) {
        userMessage = "Server internal error ";
      } else if (!status) {
        userMessage = "Network error ";
      }

      return {
        success: false,
        message: userMessage,
        errors: responseData?.errors ?? responseData ?? {},
        status,
        rawData: responseData,
      };
    }

    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "Connection failed ",
      errors: {},
    };
  }
}