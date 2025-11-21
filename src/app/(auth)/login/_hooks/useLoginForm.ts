"use client"

import type React from "react"

import { useState } from "react"
import type { LoginCredentials, AuthResponse } from "@/types/User"
import { loginUser } from "@/lib/actions/loginUser"

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginCredentials>({
    phoneNumber: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<AuthResponse | null>(null)

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

    setIsLoading(true)
    try {
      const result = await loginUser(formData)
      setResponse(result)

      if (result.success) {
        // Handle successful login - redirect to dashboard
        console.log("Redirecting to dashboard...")
        // In a real app: router.push('/dashboard')
      }
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
