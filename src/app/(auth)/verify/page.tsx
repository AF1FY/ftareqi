"use client"
import OTPVerification, { Status } from '@/components/OTPVerification'
import { userContext } from '@/context/userContext';
import { resendOTP, verifyUserRegistration } from '@/lib/actions/Auth.actions';
import { toast } from 'sonner';
import { useContext, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import useOTP from '../_hooks/useOTP';


const page = () => {
  const { phoneNumber, role } = useContext(userContext);
  const phone = phoneNumber || sessionStorage.getItem('phone-number') || ''

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
      return await verifyUserRegistration(body);
    },
    phone,
  });

  const onVerify = async (code: string) => {
    console.log("On verify from page is invoked");
    const res = await handleVerify(code);
    console.log(res);
    if (res?.success) {
      const tokens = { accessToken: res.data?.accessToken, refreshToken: res.data?.refreshToken };
      await signIn("credentials", {
        ...tokens,
        redirect: false,
        callbackUrl: '/'
      });
      toast(res.message, { duration: 4000, position: 'top-right' });
      setStatus({ message: res.message, type: 'success' });
      sessionStorage.removeItem('phone-number');
      sessionStorage.setItem('registered-toast','1')
      window.location.href = (role === 2) ? '/driver-registration' : '/';
    } else if (!res?.data) {
      await handleResend();
      setStatus({ message: 'Too many attempts, we have sent a new otp.', type: '' });
    } else {
      setStatus({ message: res?.errors?.[0] || res?.message || 'Operation failed', type: 'error' });
    }
  };

  return (
    <OTPVerification
      handleVerify={onVerify}
      handleResend={handleResend}
      status={status}
      timeLeft={timeLeft}
      resetTrigger={resetTrigger}
    />
  )
}

export default page