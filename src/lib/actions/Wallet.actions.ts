'use server'

import { AuthResponse } from "@/types/Auth";
import { ITopUpRequest, ITopUpResponse, ITransactions, IWallet, PaymentMethod } from "@/types/Wallet";
import { getDataAsync, postDataAsync } from "./Base.actions";

const BASE_ENDPOINT = `api/Wallet`;

export const getWalletAsync = async (): Promise<AuthResponse<IWallet>> => 
    getDataAsync<IWallet>(BASE_ENDPOINT, "Failed to display wallet")
// async function getWalletAsync(): Promise<AuthResponse<IWallet>> {
//     try {
//         const tokens = await getAuthTokens();
//         const res = await axios.get<AuthResponse<IWallet>>(`${BASE_URL}/${BASE_ENDPOINT}`, {
//             headers: {
//                 Authorization: `Bearer ${tokens?.accessToken}`
//             }
//         })
//         return res.data;
//     } catch (e: any) {
//         return {
//             success: false,
//             message: e.response?.data?.message || "Failed to display wallet",
//             errors: e.response?.data?.errors || ['Operation failed'],
//             data: e.response?.data?.data
//         };
//     }
// }

export const getTransactionsAsync = async (): Promise<AuthResponse<ITransactions>> => 
    getDataAsync<ITransactions>(`${BASE_ENDPOINT}/transactions`, "Failed to display transactions")

// async function getTransactionsAsync(): Promise<AuthResponse<ITransactions>> {
//     try {
//         const tokens = await getAuthTokens();
//         const res = await axios.get<AuthResponse<ITransactions>>(`${BASE_URL}/${BASE_ENDPOINT}/transactions`, {
//             headers: {
//                 Authorization: `Bearer ${tokens?.accessToken}`
//             }
//         })
//         return res.data;
//     } catch (e: any) {
//         return {
//             success: false,
//             message: e.response?.data?.message || "Failed to display wallet",
//             errors: e.response?.data?.errors || ['Operation failed'],
//             data: e.response?.data?.data
//         };
//     }
// }

export const addFundsAsync = async (body: ITopUpRequest , paymentMethod: PaymentMethod): Promise<AuthResponse<ITopUpResponse>> =>{
    const url = `${BASE_ENDPOINT}/top-up/${paymentMethod === 'wallet' ? 'mobile-wallet' : 'card'}`
    return postDataAsync<ITopUpResponse, ITopUpRequest>(url, body, 'Failed To Add Funds')
}