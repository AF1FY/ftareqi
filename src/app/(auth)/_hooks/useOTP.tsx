"use client"
import { useEffect, useState } from "react";
import { Status } from "@/components/OTPVerification";
import { VerifyOtpResponse } from "@/types/Auth";

type ResendFn = (phone: string) => Promise<any>;
type VerifyFn = (code: string, phone: string) => Promise<any>;

export default function useOTP({
    initialTime = 5,
    resendFn,
    verifyFn,
    phone = '',
}: {
    initialTime?: number;
    resendFn: ResendFn;
    verifyFn: VerifyFn;
    phone?: string;
}) {
    const [status, setStatus] = useState<Status>({ message: '', type: '' });
    const [timeLeft, setTimeLeft] = useState<number>(initialTime);
    const [resetTrigger, setResetTrigger] = useState<number>(0);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const handleResend = async () => {
        if (timeLeft > 0) return;
        setStatus({ message: 'Sending a new code...', type: 'loading' });
        const res = await resendFn(phone);
        if (res?.success) {
            setTimeLeft(60);
            setResetTrigger(prev => prev + 1);
            setStatus({ message: res.message || 'Code sent successfully!', type: 'success' });
        } else {
            setStatus({ message: res?.errors?.[0] || res?.message || 'Operation failed', type: 'error' });
        }
        return res;
    };

    const handleVerify = async (code: string): Promise<VerifyOtpResponse> => {
        console.log("Handle verify from use otp is invoked");
        setStatus({ message: 'Verifying code...', type: 'loading' });
        const res = await verifyFn(code, phone);
        setResetTrigger(prev => prev + 1);
        setTimeLeft(0);
        return res;
    };

    return {
        status,
        setStatus,
        timeLeft,
        setTimeLeft,
        resetTrigger,
        setResetTrigger,
        handleResend,
        handleVerify,
    };
}