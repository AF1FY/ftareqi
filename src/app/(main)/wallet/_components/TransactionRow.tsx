'use client'
import { getDateFormatted, getHourFormatted } from '@/lib/services/walletService';
import { ITransaction, TransactionStatus, TransactionType } from '@/types/Wallet';
import {
    Car,
    Wallet,
    ArrowUpRight,
    Clock,
    Calendar,
} from 'lucide-react';
const getTypeIcon = (type: ITransaction['type']) => {
    switch (type) {
        case TransactionType.RidePayment:
            return <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        case TransactionType.Deposit:
            return <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />;
        case TransactionType.Withdrawal:
            return <ArrowUpRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
    }
};

const getTypeBg = (type: ITransaction['type']) => {
    switch (type) {
        case TransactionType.RidePayment: return 'bg-blue-100 dark:bg-blue-900/30';
        case TransactionType.Deposit: return 'bg-green-100 dark:bg-green-900/30';
        case TransactionType.Withdrawal: return 'bg-orange-100 dark:bg-orange-900/30';
    }
};

const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
        case 'Completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'Failed':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
            return 'bg-slate-100 text-slate-800';
    }
};

const getStatusDot = (status: TransactionStatus) => {
    switch (status) {
        case 'Completed': return 'bg-green-500';
        case 'Pending': return 'bg-yellow-500 animate-pulse';
        case 'Failed': return 'bg-red-500';
        default: return 'bg-slate-500';
    }
};
const TransactionRow = ({ transaction }: { transaction: ITransaction }) => {
    const isPositive = transaction.type === TransactionType.Deposit;

    return (
        <tr className="hover:bg-white-athens-gray transition-colors cursor-pointer group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeBg(transaction.type)}`}>
                        {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                        <p className="font-semibold">{transaction.type}</p>
                        <p className="text-xs text-pale-sky">Balance Before: {transaction.balanceBefore.toFixed(2)} EGP</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {getDateFormatted(transaction.createdAt)}
                    </span>
                    <span className="text-xs text-pale-sky flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {getHourFormatted(transaction.createdAt)}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(transaction.status)}`}></span>
                    {transaction.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <p className={`text-sm font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {isPositive ? '+' : '-'} {transaction.amount.toFixed(2)} EGP
                </p>
                <p className="text-pale-sky text-xs">Balance After: {transaction.balanceAfter.toFixed(2)} EGP</p>
            </td>
        </tr>
    );
};

export default TransactionRow