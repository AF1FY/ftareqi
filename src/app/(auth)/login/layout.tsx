"use client"
import React from 'react'
import Image from "next/image"
import MapImage from '@/assets/login.png'
import DarkMapImage from '@/assets/login-dark-2.png'
const Loginlayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div className="flex w-screen h-screen bg-[#F6F7F8] dark:bg-[#0E131B] transition-colors">

            {/* Left side - Image */}
            <div className="hidden lg:block relative w-1/2 h-full">

                <Image
                    src={MapImage}
                    alt="Egypt Map"
                    fill
                    className="object-cover dark:hidden"
                    priority
                />

                <Image
                    src={DarkMapImage}
                    alt="Egypt Map Dark"
                    fill
                    className="object-cover hidden dark:block"
                    priority
                />
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-8 py-10 bg-[#F6F7F8] dark:bg-[#0E131B] transition-colors">
                <>
                    {children}
                </>
            </div>
        </div>
    )
}

export default Loginlayout