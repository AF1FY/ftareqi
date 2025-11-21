"use client"

import { useLoginForm } from "../login/_hooks/useLoginForm"
import InputField from "../login/_components/InputField"
import PasswordInput from "../login/_components/PasswordInput"
import Checkbox from "../login/_components/Checkbox"
import PrimaryButton from "../login/_components/PrimaryButton"
import SecondaryButton from '../login/_components/SecondaryButton'
import Link from "next/link"
import Image from "next/image"
import { FaGoogle, FaPhone } from "react-icons/fa"
import MapImage from '@/assets/login.png'

export default function LoginPage() {
    const { formData, errors, isLoading, handleSubmit, handleInputChange } = useLoginForm()

    return (
        <div className="flex w-screen h-screen">

            {/* Left side - Image */}
            <div className="hidden lg:block relative w-1/2 h-full">
                <Image
                    src={MapImage}
                    alt="Egypt Map"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-8 py-10 bg-[#F6F7F8]">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Welcome Back</h1>
                        <p className="text-gray-600 text-sm md:text-base">Sign in to continue your journey.</p>
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
                            icon={<FaPhone className="text-gray-400" />}
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

                        {/* Remember Me + Forgot Password */}
                        <div className="flex items-center justify-between">
                            <Checkbox
                                id="rememberMe"
                                label="Remember me"
                                checked={formData.rememberMe}
                                onChange={(checked) => handleInputChange("rememberMe", checked)}
                            />

                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Sign in button */}
                        <PrimaryButton type="submit" disabled={isLoading}>
                            Sign In
                        </PrimaryButton>

                        {/* Google button with real icon and darker background */}
                        <SecondaryButton
                            type="button"
                            icon={<FaGoogle className="mr-2" />}
                        >
                            Continue with Google
                        </SecondaryButton>

                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
