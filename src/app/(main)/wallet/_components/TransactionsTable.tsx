'use client'
import {
    AlertCircle,
    RefreshCcwIcon,
} from 'lucide-react';
import TransactionRow from './TransactionRow';
import { useQuery } from '@tanstack/react-query';
import { getTransactionsAsync } from '@/lib/actions/Wallet.actions';
import styles from '../Wallet.module.css'

import ErrorState from '@/components/ErrorState';
import Link from 'next/link';
// --- Component: Empty State ---
const EmptyState = () => (
    <tr>
        <td colSpan={4} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-medium text-slate-900 dark:text-white">No transactions found</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        It looks like you haven't made any transactions yet.
                    </p>
                </div>
                <Link href={'/add-funds'} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Start New Transaction
                </Link>
            </div>
        </td>
    </tr>
);

// --- Main Component: Transactions List ---
export default function TransactionsTable() {
    const { data: res, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => await getTransactionsAsync()
    })
    if (!res?.success)
        console.log('Response failure : ', res);
    return (
        <>
            {/* Header */}
            <div className="my-4 p-1 flex justify-end">
                <button onClick={() => refetch()} className="p-2 hover:text-dodger-blue border border-athens-gray rounded-lg bg-athens-gray cursor-pointer transition-colors">
                    <RefreshCcwIcon size={20} className={`${isLoading ? `${styles.refreshSpin} text-dodger-blue` : ''}`} />
                </button>
            </div>
            <section className="w-full border-athens-gray bg-background rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 border flex flex-col overflow-hidden">
                {/* Table Area */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className='text-foreground text-md bg-athens-gray'>
                            <tr className="border-athens-gray border-b text-xs uppercase font-semibold tracking-wider">
                                <th className="px-6 py-4">Transaction</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        {isError ? (
                            <ErrorState error={error} refetch={refetch} />
                        ) : (
                            <tbody className="divide-y divide-athens-gray">
                                {res?.data?.transactions.length ?? 0 > 0 ? (
                                    res?.data?.transactions.map((transaction) => (
                                        <TransactionRow key={transaction.id} transaction={transaction} />
                                    ))
                                ) : (
                                    <EmptyState />
                                )}
                            </tbody>
                        )}
                    </table>
                </div>
            </section>
            {/* Pagination Section */}
            {/* <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-pale-sky ps-1">
                    Showing <span className="text-foreground font-medium">{(page - 1) * 10 + 1}</span> to <span className="text-foreground font-medium">{Math.min(page * 10, res.data?.totalCount ?? 0)}</span> of <span className="text-foreground font-medium">{res.data?.totalCount ?? 0}</span> results
                </p>
                <Pagination totalPages={res.data?.totalPages ?? 0} />
            </div> */}
        </>
    );
}