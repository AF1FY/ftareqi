"use client"
import React, { useState, useRef, useEffect } from 'react';

export interface Status {
    message: string;
    type: 'success' | 'error' | 'loading' | '';
}

interface ActionProps {
    handleVerify: (otp: string) => void;
    handleResend: () => void;
    status?: Status;
    timeLeft?: number;
    resetTrigger?: number;
}

export default function OTPVerification({
    handleVerify = () => { },
    handleResend = () => { },
    status = { message: '', type: '' },
    timeLeft = 0,
    resetTrigger = 0,
}: ActionProps) {

    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const codeRef = useRef(code);
    const enterListenerAttached = useRef(false);
    const CODE_LENGTH = 6;

    useEffect(() => {
        codeRef.current = code;
    }, [code]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (resetTrigger) {
            setCode(Array(6).fill(""));
            inputsRef.current[0]?.focus();
        }
    }, [resetTrigger]);

    useEffect(() => {
        if (enterListenerAttached.current) return;
        const handleEnter = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                const currentCode = codeRef.current.join('');
                if (currentCode.length === CODE_LENGTH && status.type !== "loading") {
                    handleVerify(currentCode);
                }
            }
        };
        window.addEventListener("keydown", handleEnter);
        enterListenerAttached.current = true;
        return () => window.removeEventListener("keydown", handleEnter);
    }, []);

    //* handle typing
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (!/^[0-9]$/.test(value) && value !== "") return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < CODE_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };
    //* Key downs
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        //? Move left/right with arrows
        if (e.key === "ArrowRight") {
            if (index < CODE_LENGTH - 1) {
                inputsRef.current[index + 1]?.focus();
            }
            return;
        }
        if (e.key === "ArrowLeft") {
            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
            return;
        }
        //? Backspace navigation
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        //? Sumbit on Enter
        if (e.key === "Enter") {
            const currentCode = code.join('');
            console.log("OTP : ",currentCode);
            if (currentCode.length === CODE_LENGTH && status.type !== "loading") {
                handleVerify(currentCode);
            }
        }
    };


    //* handle paste
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, CODE_LENGTH);
        if (/^[0-9]+$/.test(pasteData)) {
            const newCode = Array(CODE_LENGTH).fill('');
            for (let i = 0; i < pasteData.length; i++) {
                newCode[i] = pasteData[i];
            }
            setCode(newCode);
            inputsRef.current[Math.min(pasteData.length - 1, CODE_LENGTH - 1)]?.focus();
        }
    };
    const isVerifyDisabled = code.join('').length !== CODE_LENGTH || status?.type === 'loading';

    return (
        <div className="w-lg lg:w-md rounded-2xl shadow-lg p-8 text-center m-auto dark:bg-[#1A202C]">
            <div className="mx-auto mb-6 bg-pale-sky/40 rounded-full w-20 h-20 flex items-center justify-center">
                <i className="fa-solid fa-comment-sms text-4xl" />
            </div>

            <h1 className="text-3xl font-bold mb-2">OTP Verification</h1>
            <p className="text-pale-sky mb-8">
                Please enter the 6-digit code sent to your phone number.
            </p>

            <div className="flex justify-between mb-6" onPaste={handlePaste}>
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => { inputsRef.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-1/7 h-14 text-center text-2xl sm:text-3xl font-bold bg-porcelain border-2 border-lavender-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparen transition"
                    />
                ))}
            </div>

            {status?.message && (
                <div className={`py-2 px-4 rounded-md text-sm mb-6 ${status.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : status.type === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                    {status.message}
                </div>
            )}

            <div className="flex flex-col gap-4">
                <button
                    onClick={() => handleVerify(code.join(''))}
                    disabled={isVerifyDisabled}
                    className={`w-full py-3 px-4 text-background font-semibold rounded-lg shadow-md transition-all duration-300 ${isVerifyDisabled
                        ? 'bg-pale-sky/60 dark:bg-pale-sky cursor-not-allowed'
                        : 'bg-foreground hover:bg-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'
                        }`}
                >
                    {status?.type === 'loading' &&
                        status.message.includes('Verifying')
                        ? 'Verifying...'
                        : 'Verify'}
                </button>

                <span>
                    Didn't receive the code?{" "}
                    <button
                        onClick={handleResend}
                        disabled={status?.type === 'loading' || timeLeft > 0}
                        className="text-dodger-blue hover:underline disabled:opacity-70 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
                    </button>
                </span>
            </div>
        </div>
    );
}