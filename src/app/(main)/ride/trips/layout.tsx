'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import styles from '../Ride.module.css';
import { usePathname } from 'next/navigation';
import { IsDriver } from '@/lib/services/userProfileService';
import { RoleToggle } from './_components/role-toggle';
const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const path: string = usePathname();
    const [isDriver, setIsDriver] = useState(false);
    const [isRiderMode, setIsRiderMode] = useState(true);
    useEffect(() => {
        (async () => {
            const value = await IsDriver();
            setIsDriver(value);

            setIsRiderMode(path.includes('rider'));
        })();
    }, [])


    return (
        <div className="full-scn lg:py-4 container px-1 md:px-4">

            <div className="mx-auto max-w-7xl px-2 py-4 sm:px-2 md:px-0">
                <div className='flex md:justify-between items-center gap-3 justify-end mb-2 sm:mb-4' >
                    <div className='text-start w-full ps-1'>
                        <h1 className='text-3xl font-bold'>My Trips</h1>
                        <p className="text-muted-foreground hidden md:block">
                            {isRiderMode
                                ? "Track your upcoming rides and trip history."
                                : "Manage your drives and incoming passenger requests."}
                        </p>
                    </div>

                    {isDriver && <RoleToggle /> }
                </div>

                <div className='mt-6'> {children} </div>
            </div>

        </div>
    )
}

export default layout