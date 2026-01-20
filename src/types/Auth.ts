import { Role } from "./User"
// User entity for domain layer
export interface LoginCredentials {
  phoneNumber: string
  password: string
}
export interface AuthResponse<T> {
  success: boolean
  message: string
  errors: string[]
  data?: T
}
export interface Tokens {
  userId?: string;
  roles?: Role[]
  accessToken: string,
  refreshToken: string,
}
export interface VerifyOtpResponse{
  remainingAttempts?: Number,
  resetToken?: string,
  accessToken?: string,
  refreshToken?: string,
}