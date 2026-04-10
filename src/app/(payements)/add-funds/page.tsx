'use client';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, CreditCard, Smartphone, Wallet, CircleCheck} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import map_view from '@/assets/map.png';
import styles from './AddFunds.module.css';
import { ITopUpRequest, PaymentMethod } from '@/types/Wallet';
import { addFundsAsync, getWalletAsync } from '@/lib/actions/Wallet.actions';
import { toast } from 'sonner';

export default function AddFunds() {
    const [amount, setAmount] = useState<number>(100);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [walletNumber, setWalletNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [walletNumberError, setWalletNumberError] = useState('');
    const [crntBalance, setCrntBalance] = useState(0);
    // Constants
    const MIN_AMOUNT = 100;
    const MAX_AMOUNT = 1000;

    const isAmountValid = (val: number): boolean => val <= MAX_AMOUNT && val >= MIN_AMOUNT
    const isWalletNumberValid = (number: string) => {
        const regex = /^(0?1[0125])[0-9]{8}$/;
        return regex.test(number);
    };

    async function getCurrentBalance() {
        const res = await getWalletAsync();
        setCrntBalance(res.data?.balance ?? 0);
    }

    useEffect(() => {
        getCurrentBalance
    }, [])
    
    // Handlers
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (isAmountValid(val))
            setError('')
        val <= MAX_AMOUNT * 90 ? setAmount(val) : setAmount(0);
        if (val < MIN_AMOUNT) {
            setError(`Minimum amount is ${MIN_AMOUNT} EGP`);
        } else if (val > MAX_AMOUNT) {
            setError(`Maximum amount is ${MAX_AMOUNT} EGP`)
        }
    };

    function handleWalletNumber(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        if (val.length > 11) return
        setWalletNumber(val);
        setWalletNumberError('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!isWalletNumberValid(walletNumber) && paymentMethod === 'wallet') {
            setWalletNumberError('Wallet Number Is Invalied');
            setIsLoading(false);
            return
        }
        const body: ITopUpRequest = {
            amount,
            walletNumber
        }
        const res = await addFundsAsync(body, paymentMethod);
        if(res.success){
            window.location.href = res.data?.paymentUrl ?? ''
        }
        toast.error(res.message);
        console.log('Res : ',res);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
            {/* Navbar */}
            <nav className="w-full border-b bg-background sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center">
                            <Link
                                href="/wallet"
                                className="relative flex items-center w-36 text-txt-secondary hover:text-royale-blue dark:hover:text-royale-blue transition-all duration-300 overflow-hidden group"
                            >
                                <div className="transition-all bg-background duration-500 group-hover:w-1/3 z-10">
                                    <div className="relative size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all duration-300 group-hover:translate-x-13 group-hover:bg-royale-blue/10">
                                        <ArrowLeft className="size-4 group-hover:text-royale-blue" />
                                    </div>
                                </div>
                                <span className="absolute z-1 end-0 font-semibold text-sm whitespace-nowrap transition-all duration-500 group-hover:end-full group-hover:opacity-0">
                                    Back to Wallet
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Lock className="w-5 h-5 text-green-500" />
                            <h1 className="font-bold text-lg tracking-tight">Secure Checkout</h1>
                        </div>
                        <div className="flex items-center">
                            <div className="hidden md:flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-txt-secondary font-medium">Encrypted Connection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="grow flex bg-white-athens-gray items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-royale-blue/5 to-transparent pointer-events-none -z-10"></div>
                <div className="absolute -right-64 top-40 w-96 h-96 bg-royale-blue/10 rounded-full blur-3xl -z-10"></div>

                <div className="w-full max-w-2xl bg-background rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-athens-gray overflow-hidden relative z-20">

                    {/* Top Progress Bar */}
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
                        <div className="h-full w-full bg-royale-blue rounded-r-full"></div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-8 md:p-10 space-y-6">

                            {/* Amount Section */}
                            <section>
                                <div className="text-center space-y-6">
                                    <div className="relative inline-block w-full max-w-sm">
                                        <label className="block text-sm font-medium text-txt-secondary mb-2" htmlFor="amount">
                                            Enter Amount
                                        </label>
                                        <div className="relative group">
                                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-pale-sky pl-4 transition-colors group-focus-within:text-royale-blue">
                                                EGP
                                            </span>
                                            <input
                                                id="amount"
                                                type="number"
                                                value={amount}
                                                onChange={handleAmountChange}
                                                className="block w-full text-center text-5xl font-extrabold bg-transparent border-none focus:ring-0 p-2 placeholder-pale-sky outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="0.00"
                                            />
                                            <div className={`h-0.5 mx-auto mt-2 transition-all duration-300 rounded-full ${!isAmountValid(amount) ? 'w-full bg-rejected-t' : 'w-1/3 group-focus-within:w-full bg-athens-gray group-focus-within:bg-royale-blue'}`}></div>
                                        </div>
                                        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
                                    </div>

                                    {/* Preset Buttons */}
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {[100, 150, 200, 500].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => { setAmount(val); setError('') }}
                                                className={`px-5 py-2 rounded-full border font-semibold hover:border-dodger-blue/80 hover:bg-dodger-blue/10 hover:text-foreground transition-all text-sm active:scale-95 cursor-pointer
                                                ${val === amount ? 'border-dodger-blue/80 bg-dodger-blue/10 text-foreground' : 'border-lavender-gray text-txt-secondary'}
                                                `}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <hr className="border-athens-gray" />

                            {/* Payment Method Tabs */}
                            <section>
                                <label className="block text-sm font-semibold mb-4">
                                    Select Payment Method
                                </label>
                                <div className="grid grid-cols-2 gap-4 p-2 bg-background/60 rounded-xl border border-athens-gray">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`relative cursor-pointer flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 border-2 ${paymentMethod === 'card'
                                            ? 'text-dodger-blue border-royale-blue shadow-sm dark:border-royale-blue'
                                            : 'text-pale-sky border-transparent hover:text-dodger-blue'
                                            }`}
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        <span className="font-bold text-sm">Card</span>
                                        {paymentMethod === 'card' && (
                                            <div className="absolute -top-2 -right-2 bg-background text-royale-blue rounded-full p-0.5 shadow-sm">
                                                <CircleCheck className='size-4' />
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('wallet')}
                                        className={`relative cursor-pointer flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 border-2 ${paymentMethod === 'wallet'
                                            ? 'text-dodger-blue border-royale-blue shadow-sm dark:border-royale-blue'
                                            : 'text-pale-sky border-transparent hover:text-dodger-blue'
                                            }`}
                                    >
                                        <Smartphone className="w-5 h-5" />
                                        <span className="font-bold text-sm">Mobile Wallet</span>
                                        {paymentMethod === 'wallet' && (
                                            <div className="absolute -top-2 -right-2 text-royale-blue rounded-full p-0.5 bg-background shadow-sm">
                                                <CircleCheck className='size-4' />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </section>

                            {/* Dynamic Content */}
                            <section>
                                {paymentMethod === 'card' ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="border border-dodger-blue/40 bg-dodger-blue/5 rounded-xl p-6 text-center">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <CreditCard className="w-6 h-6 text-royale-blue" />
                                            </div>
                                            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">External Payment Gateway</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                You will be redirected to a secure page to enter your card details and complete the transaction.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="relative group">
                                            <label className="block text-sm font-bold mb-2 ml-1" htmlFor="wallet-number">
                                                Wallet Mobile Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Smartphone className="text-pale-sky group-focus-within:text-royale-blue transition-colors w-5 h-5" />
                                                </div>
                                                <input
                                                    id="wallet-number"
                                                    type="tel"
                                                    value={walletNumber}
                                                    onChange={handleWalletNumber}
                                                    className="block w-full pl-12 pr-4 py-4 bg-porcelain border-2 border-lavender-gray rounded-xl text-lg font-medium placeholder-pale-sky focus:outline-none focus:border-royale-blue focus:ring-0 transition-all shadow-sm"
                                                    placeholder="e.g., 010 xxxx xxxx"
                                                />
                                            </div>
                                            <p className="text-red-500 text-start ps-1 mt-3">{walletNumberError}</p>
                                            {/* <p className="text-sm text-dodger-blue/80 mt-3 ms-1 flex items-center gap-2 border-dodger-blue/40 bg-dodger-blue/5 p-3 rounded-lg border dark:border-blue-800/30">
                                                <Info className="text-royale-blue size-5 shrink-0" />
                                                <span className="leading-snug">
                                                    You will receive a USSD notification on this number to confirm payment.
                                                </span>
                                            </p> */}
                                        </div>
                                    </div>
                                )}
                            </section>

                        </div>

                        {/* Footer Summary */}
                        <div className="bg-background border-t border-athens-gray p-6 md:p-8">
                            <div className="flex flex-col space-y-4">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-txt-secondary/80">Transaction Fee</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">0.00 EGP</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-800 dark:text-slate-200 font-bold text-lg">Total to Pay</span>
                                    <span className="text-royale-blue font-bold text-2xl">
                                        {amount >= 0 ? amount.toFixed(2) : '0.00'} EGP
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isAmountValid(amount) || isLoading}
                                    className="w-full bg-royale-blue hover:bg-[#1649c2] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg shadow-royale-blue/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center group"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                                            Confirm & Add Funds
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Sidebar Image (Desktop) - FIXED Z-INDEX */}
            <div className="hidden lg:block fixed right-0 top-0 h-full w-1/3 bg-background border-s border-white-athens-gray dark:border-0 z-10 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-l from-transparent to-white-athens-gray z-10 w-32"></div>

                <div className="w-full h-full relative">
                    <Image
                        alt="Map view"
                        className="object-cover opacity-50 dark:opacity-20 grayscale"
                        src={map_view}
                        fill
                        priority
                    />
                </div>

                {/* Current Balance Card */}
                <div className={`${styles.crntBalance} absolute top-32 right-12 z-20 bg-background backdrop-blur-md p-6 rounded-xl shadow-lg border border-athens-gray max-w-xs w-full`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-txt-secondary">Current Balance</span>
                        <div className="text-royale-blue bg-royale-blue/10 p-2 rounded-full">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold">
                        {crntBalance.toFixed(2)} <span className="text-sm font-medium text-txt-secondary">EGP</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-athens-gray">
                        <div className="text-xs text-txt-secondary flex justify-between">
                            <span>Adding</span>
                            <span className="text-royale-blue font-bold">+{isAmountValid(amount) ? amount : 0} EGP</span>
                        </div>
                        <div className="mt-1 flex justify-between items-center">
                            <span className="text-xs font-semibold">New Balance</span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                {(crntBalance + (isAmountValid(amount) ? amount : 0)).toFixed(2)} EGP
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}