"use client"
import Image from 'next/image'
import React, { useContext } from 'react'
import Link from 'next/link';
import logo from '@/app/favicon.ico';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
const Navbar = () => {
    const path: string = usePathname();
    const isAuthenticated = false
    return (
        <nav className='py-2 bg-background shadow-sm shadow-athens-gray md:fixed w-full z-10'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center gap-2'>
                <div className='flex items-center flex-col md:flex-row gap-4 md:gap-8'>
                    <Link href={'/'}>
                        <div className='flex gap-4 items-center'>
                            <Image src={logo} alt='ftareqi logo' className='size-12' />
                            <h1 className='text-2xl font-bold'>Ftareqi</h1>
                        </div>
                    </Link>
                </div>
                <div>
                    <ul className='flex flex-col md:flex-row gap-4 items-center'>
                        {isAuthenticated ? <>
                            {/* <li>
                                <p className='text-(color:--color-main)'>Hi, {data?.user.name.split(' ')[0]}</p>
                            </li>*/}
                            <li>
                                <button className='cursor-pointer' onClick={() => {
                                    signOut({
                                        callbackUrl: '/login'
                                    })
                                }}> Logout </button>
                            </li>
                        </> : <>
                            <li hidden={path.includes('login')}>
                                <Link href={'/login'}> Login </Link>
                            </li>
                            <li hidden={path.includes('register')}>
                                <Button asChild>
                                    <Link href={'/register'}> Join us </Link>
                                </Button>
                            </li>
                        </>
                        }
                        <li>
                            <ModeToggle />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar