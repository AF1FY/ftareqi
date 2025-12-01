"use client"

import { useLoginForm } from "../login/_hooks/useLoginForm"
import InputField from "../login/_components/InputField"
import PasswordInput from "../login/_components/PasswordInput"
import PrimaryButton from "../login/_components/PrimaryButton"
import Link from "next/link"
import { FaPhone } from "react-icons/fa"
import { toast } from "sonner"

export default function LoginPage() {
    const { formData, errors, isLoading, response, handleSubmit, handleInputChange } = useLoginForm()

    if (response?.success) {
        toast.success(response.message, { duration: 2500, position: 'top-right' });
    }
    else if (response?.success === false) {
        console.log("Errors : ", response?.errors);
        toast.error(response?.message, { duration: 2500, position: 'top-right' })
    }
    return (
        <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Sign in to continue your journey.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Phone Number */}
                <InputField
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange("phoneNumber", value)}
                    error={errors.phoneNumber}
                    icon={<FaPhone className="text-gray-400 dark:text-gray-300" />}
                    required
                />

                {/* Password */}
                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(value) => handleInputChange("password", value)}
                    error={errors.password}
                    required
                />
                <div className="text-end me-1 text-dodger-blue hover:underline"><Link href={'/login/forget-password'}>Forgot Password?</Link></div>
                {/* Sign in button */}
                <PrimaryButton type="submit" disabled={isLoading}>
                    Sign In
                </PrimaryButton>

            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Don't have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>

        </div>
    )
}
