// User entity for domain layer
export interface LoginCredentials {
  phoneNumber: string
  password: string
  rememberMe: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    phoneNumber: string
  }
}
