"use client"
import React, { useState, useRef, useEffect, useContext } from 'react';
import { userContext } from '@/context/userContext';
import axios from 'axios';
import { AuthResponse } from '@/types/User';
import { resendOTP, verifyUserRegistration } from '@/lib/actions/Auth.actions';
import { toast } from 'sonner';

interface Status {
    message: string;
    type: 'success' | 'error' | 'loading' | '';
}

// The core OTP Verification component
export default function OTPVerification() {
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [status, setStatus] = useState<Status>({ message: '', type: '' });
    const [timeLeft, setTimeLeft] = useState(2);
    const { phoneNumber } = useContext(userContext);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const CODE_LENGTH = 6;

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        // Only allow a single digit
        if (!/^[0-9]$/.test(value) && value !== "") return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Move to next input if a digit is entered
        if (value && index < CODE_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, CODE_LENGTH);
        if (/^[0-9]+$/.test(pasteData)) {
            const newCode = Array(CODE_LENGTH).fill('');
            for (let i = 0; i < pasteData.length; i++) {
                newCode[i] = pasteData[i];
            }
            setCode(newCode);
            // Focus the last pasted input or the next empty one
            const focusIndex = Math.min(pasteData.length, CODE_LENGTH - 1);
            inputsRef.current[focusIndex]?.focus();
        }
    };

    //* Verification
    const handleVerify = async () => {
        setStatus({ message: 'Verifying code...', type: 'loading' });
        const fullCode = code.join('');
        const body = {
            otpCode: fullCode,
            phoneNumber
        }
        if (fullCode.length !== CODE_LENGTH) {
            setStatus({ message: 'Please enter all 6 digits.', type: 'error' });
            return;
        }
        const res = await verifyUserRegistration(body)
        console.log(res);
        if (res?.success) {
            toast(res.message , {duration: 4000 , position: 'top-right'})
            setStatus({ message: res.message, type: 'success' });
            
            // setTimeout(() => {
            //     window.location.href = "/";
            // }, 1500);
        } else {
            setStatus({ message: res.errors.at(0) || res.message || 'Operation failed', type: 'error' });
            setCode(Array(6).fill(""));
            inputsRef.current[0]?.focus();
            setTimeLeft(0);
        }
    };

    //* Resend verification code
    const handleResend = async () => {
        if (timeLeft > 0) return;
        setStatus({ message: 'Sending a new code...', type: 'loading' });
        const res = await resendOTP(phoneNumber);
        console.log("Resend response : ",res);
        if (res.success) {
            setTimeLeft(60);
            setCode(Array(6).fill(""));
            inputsRef.current[0]?.focus();
            setStatus({ message: res.message || 'Code sent successfully!', type: 'success' });
        } else {
            setStatus({ message: res.errors.at(0) || res.message || 'Operation failed', type: 'error' });
        }
    };

    const isVerifyDisabled = code.join('').length !== CODE_LENGTH || status.type === 'loading';

    return (
        <div className="w-lg lg:w-md rounded-2xl shadow-lg p-8 text-center m-auto dark:bg-[#1A202C]">
            <div className="mx-auto mb-6 bg-pale-sky/40 rounded-full w-20 h-20 flex items-center justify-center">
                <i className="fa-solid fa-comment-sms text-4xl" />
            </div>

            <h1 className="text-3xl font-bold mb-2">OTP Verification</h1>
            <p className="text-pale-sky mb-8">Please enter the 6-digit code sent to your phone number.</p>

            {/* Input Fields */}
            <div className="flex justify-between mb-6" onPaste={handlePaste}>
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => { inputsRef.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-1/7 h-14 text-center text-2xl sm:text-3xl font-bold bg-porcelain border-2 border-lavender-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white  focus:border-transparen transition"
                    />
                ))}
            </div>

            {/* Status Message */}
            {status.message && (
                <div className={`py-2 px-4 rounded-md text-sm mb-6 ${status.type === 'success' ? 'bg-green-100 text-green-700' :
                    status.type === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {status.message}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleVerify}
                    disabled={isVerifyDisabled}
                    className={`w-full py-3 px-4 text-background font-semibold rounded-lg shadow-md transition-all duration-300 ${isVerifyDisabled
                        ? 'bg-pale-sky/60 dark:bg-pale-sky cursor-not-allowed'
                        : 'bg-foreground hover:bg-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'
                        }`}
                >
                    {status.type === 'loading' && status.message.includes('Verifying') ? 'Verifying...' : 'Verify'}
                </button>
                <span>
                    Didn't receive the code? <button
                        onClick={handleResend}
                        disabled={status.type === 'loading' || timeLeft > 0}
                        className="text-dodger-blue hover:underline disabled:opacity-70 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
                    </button>
                </span>

            </div>
        </div>
    );
}
