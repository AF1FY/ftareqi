"use client"

import * as React from "react"
import { useContext } from "react"
import { useRouter } from "next/navigation"
import { userContext } from '@/context/userContext'
import { resendOTP, verifyOtpToResetPasswordAsync } from '@/lib/actions/Auth.actions'
import { toast } from 'sonner'
import OTPVerification, { Status } from "@/components/OTPVerification"
import useOTP from "../../_hooks/useOTP"


export default function OTPVerificationPage() {
  const { phoneNumber } = useContext(userContext);
  const phone = phoneNumber || sessionStorage.getItem('phone-number') || ''
  const router = useRouter();

  const {
    status,
    setStatus,
    timeLeft,
    resetTrigger,
    handleResend,
    handleVerify
  } = useOTP({
    initialTime: 5,
    resendFn: resendOTP,
    verifyFn: async (code: string, phoneArg: string) => {
      const body = { otp: code, phoneNumber: phoneArg };
      return await verifyOtpToResetPasswordAsync(body);
    },
    phone,
  });

  const onVerify = async (code: string) => {
    const res = await handleVerify(code);
    console.log(res);
    if (res?.success) {
      toast(res.message, { duration: 4000, position: 'top-right' });
      sessionStorage.setItem('reset-token', res.data?.resetToken ?? '');
      router.push('/login/reset-password');
      setStatus({ message: res.message, type: 'success' });
    } else if (!res?.data?.remainingAttempts) {
      await handleResend();
      setStatus({ message: 'Too many attempts, we have sent a new otp.', type: '' });
    } else {
      setStatus({ message: res?.errors?.[0] || res?.message || 'Operation failed', type: 'error' });
    }
  };

  return (
    <OTPVerification handleVerify={onVerify} handleResend={handleResend} status={status} timeLeft={timeLeft} resetTrigger={resetTrigger} />
  )
}
