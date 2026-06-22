export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export enum TransactionType {
    Deposit = 'Deposit',
    Withdrawal = 'Withdrawal',
    RidePayment = 'Ride Payment',
    Earnings = 'Earnings',
    Refund = 'Refund',
    locked = 'locked',
    Released = 'Released'
}

export type PaymentMethod = 'wallet' | 'card'

export interface ITransaction {
    id: string;
    type: TransactionType;
    balanceBefore: number;
    balanceAfter: number;
    amount: number;
    status: TransactionStatus;
    createdAt: string;
    updatedAt: string
}

export interface IWallet {
    id: number;
    balance: number;
    lockedBalance: number;
    isLocked: boolean;
    createdAt: string;
    updatedAt: string
}

export interface ITransactions {
    userWalletId: number;
    transactions: ITransaction[]
}

export interface ITopUpRequest {
    walletNumber?: string,
    amount: number
}

export interface ITopUpResponse {
    paymentUrl: string
}