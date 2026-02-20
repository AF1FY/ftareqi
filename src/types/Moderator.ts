import { AuthResponse } from "./Auth";
export interface DriverRequestItem {
    driverProfileId: number;
    fullName: string;
    phoneNumber: string;
    createdAt: string;
    driverPhoto: string
}
export interface PaginatedData<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
export interface GetDriversParams {
    page: number;
    pageSize: number;
    descending: boolean;
}
export enum DriverStatus {
    Pending = 'Pending',
    Active = 'Active',
    Rejected = 'Rejected',
    PendingImageUpload = 'PendingImageUpload'
}
export const StatusStyles: Record<string, string> = {
    [DriverStatus.Pending]: 'bg-pending text-pending-t',
    [DriverStatus.Active]: 'bg-approved text-approved-t',
    [DriverStatus.Rejected]: 'bg-rejected text-rejected-t',
    [DriverStatus.PendingImageUpload] : 'bg-pending text-pending-t',
    ['none']: 'bg-gray-100 text-gray-600'
}
export interface DriverDetailsType {
    fullName: string;
    phoneNumber: string;
    driverStatus: DriverStatus;
    driverLicenseExpiryDate: string;
    profileCreationDate: string;
    driverPhoto: string;
    driverLicenseFront: string;
    driverLicenseBack: string;
}
export interface CarDetailsType {
    model: string;
    color: string;
    plate: string;
    numOfSeats: number;
    carPhoto: string;
    carLicenseFront: string;
    carLicenseBack: string;
}
export interface DriverProfileDetails extends DriverDetailsType, CarDetailsType {
    profileId: number;
}
export const CAR_COLORS_MAP: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    silver: '#C0C0C0',
    gray: '#808080',
    red: '#DC2626',
    blue: '#2563EB',
    navy: '#000080',
    green: '#16A34A',
    yellow: '#EAB308',
    gold: '#FFD700',
    orange: '#F97316',
    brown: '#8B4513',
    beige: '#F5F5DC',
    purple: '#9333EA',
    maroon: '#800000',
    charcoal: '#36454F',
    cream: '#FFFDD0',
    champagne: '#F7E7CE',
    bronze: '#CD7F32'
};