'use client'
import { getDateFormatted, getHourFormatted } from '@/lib/services/walletService';
import { ITransaction, TransactionStatus, TransactionType } from '@/types/Wallet';
import {
    Car,
    Wallet,
    ArrowUpRight,
    Clock,
    Calendar,
    Lock,
    LockOpen,
} from 'lucide-react';
const getTypeIcon = (type: ITransaction['type']) => {
    switch (type) {
        case TransactionType.RidePayment:
            return <Car className="w-5 h-5 text-dodger-blue" />;
        case TransactionType.Deposit:
            return <Wallet className="w-5 h-5 text-approved-t/80" />;
        case TransactionType.Withdrawal:
            return <ArrowUpRight className="w-5 h-5" />;
        case TransactionType.locked:
            return <Lock className="w-5 h-5 text-pale-sky" />;
        case TransactionType.Released:
            return <LockOpen className="w-5 h-5" />;
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
    const isPositive = transaction.type === TransactionType.Deposit ? true : transaction.type === TransactionType.Released;

    return (
        <tr className="hover:bg-white-athens-gray transition-colors cursor-pointer group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center}`}>
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold}`}>
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