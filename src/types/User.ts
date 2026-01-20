import { Tokens } from "@/types/Auth";

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

export interface Role{
  Admin: 'Admin'
  Moderator: 'Moderator'
  User: 'User'
}