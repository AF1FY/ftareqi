import { Tokens } from "@/lib/token"

// User entity for domain layer
export interface LoginCredentials {
  phoneNumber: string
  password: string
  rememberMe: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  errors: string[]
  data: any
}

export interface LoginResponse extends AuthResponse{
  data: Tokens | null
}