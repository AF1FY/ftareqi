import { ReactNode } from 'react';
import { TransactionType } from './Wallet'

export enum NotificationCategory {
    Ride = "Ride",
    Wallet = "Wallet",
    DriverRegistration = "DriverRegistration",
    System = "System",
    Review = 'Review',
}


export enum NotificationEventCode {
    //* Ride
    bookingRequest = 'bookingRequest',
    bookingAccepted = 'bookingAccepted',
    bookingDeclined = 'bookingDeclined',
    bookingCanceled = 'bookingCanceled',
    DriveCheckedIn = 'DriveCheckedIn',
    RideStarted = 'RideStarted',
    RideCancelled = 'RideCancelled',
    //* Wallet
    WalletCharged = 'WalletCharged',
    WalletWithdrawn = 'WalletWithdrawn',
    AmountReserved = 'AmountReserved',
    AmountReleased = 'AmountReleased',

    //* DriverRegistration
    Approved = 'Approved',
    Rejected = 'Rejected',
    Expired = 'Expired',

    //* Review
    ReviewAdded = 'ReviewAdded',
}

//* 2. Metadata Interfaces (The parsed version of the "data" string)
export interface BaseNotificationMetadata {
    Preview: string;
}

export interface WalletTransactionMetadata extends BaseNotificationMetadata {
    Type: TransactionType;
    Amount: number;
}

export interface AppNotification<T> {
    id: number;
    title: string;
    category: NotificationCategory;
    eventCode: NotificationEventCode;
    relatedEntityId: string;
    data: T; //* This is the raw JSON string from the backend
    isRead: boolean;
    createdAt: string;
}

export type AllNotificationMetadata = BaseNotificationMetadata | WalletTransactionMetadata;