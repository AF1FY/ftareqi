import Link from 'next/link'
import TransactionsTable from './_components/TransactionsTable'
import { getWalletAsync } from '@/lib/actions/Wallet.actions'
import { IWallet } from '@/types/Wallet'
import { getDateFormatted, getHourFormatted, isToday } from '@/lib/services/walletService'
import styles from './Wallet.module.css'
const Wallet = async () => {
    function handleUpdatedDate(date?: string) {
        if (!date) return null;
        if (isToday(date))
            return getHourFormatted(date)
        return `${getDateFormatted(date)} ${getHourFormatted(date)}`
    }
    const res = await getWalletAsync();
    if(!res.success)
        console.log('Response Failure : ', res);
    const wallet: IWallet | undefined = res.data;

    return (
        <div className='md:full-scn container p-8'>
            {/* //? Balance Card */}
            <section className="relative mb-10 overflow-hidden rounded-xl bg-linear-to-br from-blue-700 via-royale-blue to-blue-500 dark:from-blue-900 dark:via-royale-blue dark:to-blue-800 text-white shadow-lg shadow-blue-500/20">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    {/* //? Current Balance */}
                    <div className="space-y-2">
                        <p className="ps-1 font-medium flex items-center gap-2">
                            <i className="fa-solid fa-wallet text-sm" />
                            Current Balance
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{wallet?.balance.toFixed(2) ?? 'N/A'}</h2>
                            <span className="text-xl md:text-2xl font-medium text-gray-200">EGP</span>
                        </div>
                        {/* //? Locked balance show it only if there are */}
                        {wallet?.isLocked && (<div className="text-orange-400 flex items-center gap-2">
                            <i className='fa-solid fa-lock' />
                            <p>Locked Balance: {wallet?.lockedBalance.toFixed(2)} <span className="text-gray-200">EGP</span></p>
                        </div>)}
                        <p className="text-sm ps-1.5">Last updated: <span className="text-gray-200">{handleUpdatedDate(wallet?.updatedAt) ?? 'N/A'}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href={'/add-funds'}
                            className=" relative group overflow-hidden flex items-center justify-center py-2 rounded-lg font-semibold shadow-sm transition-all duration-300 cursor-pointer bg-white text-royale-blue ps-8 pe-4 hover:px-6">
                            <i className='fa-solid fa-plus-circle absolute left-2 group-hover:-left-10 transition-all duration-400 group-hover:opacity-0' />
                            <span>Add Funds</span>
                        </Link>
                        <Link
                            href={`${wallet?.isLocked ? '#' : '/cashout'}`}
                            className={`${styles.cashout} ${wallet?.isLocked ? 'hover:text-orange-400 cursor-not-allowed' : 'cursor-pointer'} flex-1 md:flex-none flex items-center justify-center relative group gap-2 ps-6.5 pe-4 py-3 overflow-hidden bg-blue-600/40 hover:bg-blue-600/60 text-white border border-white/20 backdrop-blur-sm font-semibold rounded-lg transition-all`}>
                            {wallet?.isLocked ? (
                                <i className={`fa-solid fa-lock absolute left-2 ${styles.lockShake}`} />) : (
                                <>
                                    <i className='fa-solid fa-arrow-up absolute left-2 top-1/2 -translate-y-1/2 group-hover:-top-4 transition-all duration-200' />
                                    <i className='fa-solid fa-arrow-up absolute left-2 -bottom-7 group-hover:bottom-1/2 group-hover:translate-y-1/2 transition-all duration-300' />
                                </>
                            )}
                            <span className={`ps-2.5 transition-all duration-400`}>Cash Out</span>
                        </Link>
                    </div>
                </div>
            </section>
            <TransactionsTable />
        </div>
    )
}

export default Wallet