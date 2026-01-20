"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import Logo from './Logo';
import { signOutUser } from '@/lib/actions/Auth.actions';
import { toast } from 'sonner';
import { useEffect } from 'react';
const Navbar = () => {
    const session = useSession();
    const path: string = usePathname();
    const isAuthenticated = !session.data?.isRefreshTokenExpired && session.status === 'authenticated';
    //* Handling signout
    const handleSignout = async () => {
        const res = await signOutUser();
        if (res.success) {
            toast("See you soon!", { position: 'top-right', duration: 1900 });
            setTimeout(async () => {
                await signOut({ callbackUrl: '/login' })
            }, 2000);
        } else {
            toast.error(res.message, { position: 'top-right', duration: 4000 });
        }
    }
    //* After login
    useEffect(() => {
        const flag = sessionStorage.getItem('login-toast');
        if (flag) {
            setTimeout(() => {
                toast('Welcome back!', { duration: 3000, position: 'top-right' });
            }, 100);
            sessionStorage.removeItem('login-toast');
        }
    }, []);
    //* If refresh token is expired
    useEffect(() => {
        if (session.data?.isRefreshTokenExpired)
            handleSignout();
    }, [session.data?.isRefreshTokenExpired])
    return (
        <nav className='md:h-16 p-2 bg-background md:flex md:items-center border-b border-athens-gray flex-1 z-10'>
            <div className='w-full px-2 mx-auto flex flex-col md:flex-row justify-between items-center gap-2'>
                <Link href={'/'} className='w-32'>
                    <Logo />
                </Link>
                <div>
                    <ul className='flex flex-col md:flex-row gap-4 items-center font-bold'>
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
                            <Link href={'/dashboard'} className='hover:underline'> Dashboard </Link>
                        </li>
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