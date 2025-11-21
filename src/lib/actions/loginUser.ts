import type { LoginCredentials, AuthResponse } from '@/types/User'

// Mock authentication use case
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Login attempt:", {
        phoneNumber: credentials.phoneNumber,
        password: "***",
        rememberMe: credentials.rememberMe,
      })

      // Mock validation
      if (credentials.phoneNumber && credentials.password.length >= 6) {
        resolve({
          success: true,
          message: "Login successful",
          user: {
            id: "1",
            phoneNumber: credentials.phoneNumber,
          },
        })
      } else {
        resolve({
          success: false,
          message: "Invalid credentials",
        })
      }
    }, 800)
  })
}