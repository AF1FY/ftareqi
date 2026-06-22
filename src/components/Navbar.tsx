"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { signOutUser } from '@/lib/actions/Auth.actions';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useRegisterFcmToken } from '@/hooks/useFcmToken';
import NotificationBell from './NotificationBell';

const Navbar = ({ logo }: { logo?: React.ReactNode }) => {
    const session = useSession();
    const path: string = usePathname();
    const isAuthenticated = !session.data?.isRefreshTokenExpired && session.status === 'authenticated';
    const { mutate: registerFcmToken } = useRegisterFcmToken();

    //* Handling signout
    const handleSignout = async () => {
        const res = await signOutUser();
        console.log('Sign out res : ',res);
        if (res.success) {
            toast("See you soon!", { position: 'top-right', duration: 1900 });
            setTimeout(async () => {
                await signOut({ callbackUrl: '/login' })
            }, 2000);
        } else {
            console.error('Error in signing out : ',res.message);
        }
    }
    //* After login
    useEffect(() => {
        const isFCMTokenFlag = sessionStorage.getItem('login-toast') || sessionStorage.getItem('registered-toast'); //? Ask for notification permession and register fcm token
        if (isFCMTokenFlag) {
            registerFcmToken();
            sessionStorage.removeItem('registered-toast');
        }
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
                    {logo}
                </Link>
                <div>
                    <ul className='flex flex-col md:flex-row gap-4 items-center font-bold'>
                        {isAuthenticated ? <>
                            <li>
                                <NotificationBell />
                            </li>
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
                        {isAuthenticated && (
                            <li>
                                <Link href={'/home'} className='hover:underline'> Home </Link>
                            </li>
                        )}
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