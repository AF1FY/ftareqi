"use client"

import type React from "react"
import { useContext, useState } from "react"
import type { LoginCredentials, AuthResponse, Tokens } from "@/types/Auth"
import { formatPhoneNumber, LoginSchemaType } from "@/lib/validators/auth.schema"
import { signIn } from "next-auth/react";
import { loginUser, resendOTP } from "@/lib/actions/Auth.actions"
import { toast } from "sonner"
import { userContext } from "@/context/userContext"
import { useRouter } from "next/navigation"

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginSchemaType>({
    phoneNumber: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [response] = useState<AuthResponse<Tokens> | null>(null)
  const { updatePhoneNumber, role } = useContext(userContext);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\+?[\d\s\-()]{7,}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    const credentials = {
      phoneNumber: formatPhoneNumber(formData.phoneNumber),
      password: formData.password
    }
    setIsLoading(true)
    try {
      console.log(credentials);
      const res = await loginUser(credentials);
      if (res.success) {
        //* FCM Registration
        sessionStorage.setItem('login-toast', 'true');
        const tokens = { 
          accessToken: res.data?.accessToken,
          refreshToken: res.data?.refreshToken,
        };
        const result = await signIn("credentials", {
          ...tokens,
          redirect: false,
          callbackUrl: '/'
        });
        window.location.href = role === 1 ? result?.url ?? "/" : '/driver-registration';
      } else if (res.errors.at(0)?.toLowerCase().includes('not confirmed')) {
        await resendOTP(credentials.phoneNumber);
        updatePhoneNumber(credentials.phoneNumber);
        sessionStorage.setItem('phone-number', credentials.phoneNumber);
        toast.error('Phone number is not confirmed, We have send an OTP', { duration: 4000, position: 'top-right' });
        router.push('/register/verify');
      } else {
        toast.error(res.errors.at(0) || res.message || 'Invalid Credentials!', { duration: 4000, position: 'top-right' });
      }
      console.log("From login action : ", res);
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  return {
    formData,
    errors,
    isLoading,
    response,
    handleSubmit,
    handleInputChange,
  }
}
