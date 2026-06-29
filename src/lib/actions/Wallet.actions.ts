"use server";

import { AuthResponse } from "@/types/Auth";
import {
    ITopUpRequest,
    ITopUpResponse,
    ITransaction,
    ITransactions,
    IWallet,
    PaymentMethod,
} from "@/types/Wallet";
import {
    getDataAsync,
    getPaginatedDataAsync,
    postDataAsync,
} from "./Base.actions";
import { PaginatedData } from "@/types/Moderator";

const BASE_ENDPOINT = `api/Wallet`;

export const getWalletAsync = async (): Promise<AuthResponse<IWallet>> =>
    getDataAsync<IWallet, undefined>(BASE_ENDPOINT);

export const getTransactionsAsync = async (
    page = 1,
    pageSize = 10,
): Promise<AuthResponse<PaginatedData<ITransaction>>> =>
    getPaginatedDataAsync<ITransaction, { Page?: number; PageSize?: number }>(
        `${BASE_ENDPOINT}/transactions`,
        "",
        undefined,
        undefined,
        { Page: page, PageSize: pageSize },
    );

export const addFundsAsync = async (
    body: ITopUpRequest,
    paymentMethod: PaymentMethod,
): Promise<AuthResponse<ITopUpResponse>> => {
    const url = `${BASE_ENDPOINT}/top-up/${paymentMethod === "wallet" ? "mobile-wallet" : "card"}`;
    return postDataAsync<ITopUpResponse, ITopUpRequest>(
        url,
        body,
        "Failed To Add Funds",
    );
};
