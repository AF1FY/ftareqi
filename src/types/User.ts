import { AuthResponse, Tokens } from "@/types/Auth";
import { DriverStatus } from "./Moderator";

// User entity for domain layer
export interface LoginCredentials {
  phoneNumber: string
  password: string
  rememberMe: boolean
}

export enum Role{
  Admin= 'Admin',
  Moderator= 'Moderator',
  User= 'User'
}

export interface IUsersParams{
  SortBy?: 'CreatedAt',
  PhoneNumber?: string,
  FullName?: string,
  Page?: number,
  PageSize?: number,
  SortDescending?: boolean
}

export interface IGetUsers{
  id: string,
  fullName: string,
  phoneNumber: string,
  createdAt: string,
  driverStatus?: DriverStatus
}