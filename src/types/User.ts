import { AuthResponse, Tokens } from "@/types/Auth";
import { DriverStatus } from "./Moderator";
import { StaticImageData } from "next/image";

// User entity for domain layer
export interface LoginCredentials {
  phoneNumber: string
  password: string
  rememberMe: boolean
}

export enum Role {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User'
}

export enum IGender {
  Male = 'Male',
  Female = 'Female'
}

export interface IUsersParams {
  SortBy?: 'CreatedAt',
  PhoneNumber?: string,
  FullName?: string,
  Page?: number,
  PageSize?: number,
  SortDescending?: boolean
}

export interface IGetUsers {
  id: string,
  fullName: string,
  phoneNumber: string,
  createdAt: string,
  driverStatus?: DriverStatus
}

export interface IUserDetails {
  id: string,
  fullName: string,
  phoneNumber: string,
  image?: string,
  roles: Role[]
}