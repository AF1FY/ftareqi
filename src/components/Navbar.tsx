"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import Logo from './Logo';
import { signOutUser } from '@/lib/actions/Auth.actions';
const Navbar = () => {
    const session = useSession();
    const handleSignout = async () => {
        const res = await signOutUser();
        console.log(res);
        if(res.success){
            const data = await signOut({callbackUrl:'/login'})
            console.log(data);
        }
    }
    const path: string = usePathname();
    const isAuthenticated = !session.data?.isRefreshTokenExpired && session.status === 'authenticated';
    return (
        <nav className='py-2 bg-background shadow-sm shadow-athens-gray fixed w-full z-10'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center gap-2'>
                <Link href={'/'} className='w-2/12 md:w-1/12'>
                    <Logo />
                </Link>
                <div>
                    <ul className='flex flex-col md:flex-row gap-4 items-center'>
                        {isAuthenticated ? <>
                            {/* <li>
                                <p className='text-(color:--color-main)'>Hi, {data?.user.name.split(' ')[0]}</p>
                            </li>*/}
                            <li>
                                <button className='cursor-pointer' onClick={handleSignout}>Logout</button>
                            </li>
                        </> : <>
                            <li hidden={path.includes('login')}>
                                <Link href={'/login'} className='hover:underline'> Login </Link>
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