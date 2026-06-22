'use client'
import { getProfileAsync } from '@/lib/actions/Profile.actions'
import { getFullNameLatters } from '@/lib/services/userProfileService'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../Main.module.css';

const LoadingState = ({ expanded }: { expanded: boolean }) => {
    return (
        <div className={`p-3 pt-4 flex items-center relative animate-pulse ${styles.borderTop80}`}>
            <div className="size-8 rounded-full bg-gray-300"></div>
            <div
                className={`flex flex-col ml-3 gap-2 overflow-hidden transition-all duration-300 ${expanded ? "w-40 opacity-100" : "w-0 opacity-0"
                    }`}
            >
                <span className="rounded-lg w-12 py-1 bg-gray-300"></span>
                <span className="rounded-lg w-24 py-1 bg-gray-300"></span>
            </div>
        </div>
    )
}

const AsideUser = ({ expanded }: { expanded: boolean }) => {
    const { data: res, isLoading, isError, error } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await getProfileAsync();
            return res;
        },
        keepPreviousData: true
    })
    const user = res?.data;
    // console.log('User : ',user);
    if (isError)
        console.log('Error in loading user profile : ', error);
    return (
        <>
            {isLoading ? (<LoadingState expanded={expanded} />) : (
                <div className={`p-0 py-4 flex items-center justify-center relative ${styles.borderTop80}`}>
                    <Link href='/profile'>
                        {user?.userImage ? (
                            <Image
                                src={user.userImage}
                                alt={user?.fullName ?? 'user profile image'}
                                className="rounded-lg"
                                width={40}
                                height={40}
                            />
                        ) : (<>
                            <div className='size-10 rounded-lg flex items-center justify-center bg-athens-gray font-semibold' >
                                {getFullNameLatters(user?.fullName)}
                            </div>
                        </>)}
                    </Link>
                    <div
                        className={`flex flex-col overflow-hidden transition-all duration-300 ${expanded ? "w-40 opacity-100 ml-3" : "w-0 opacity-0"
                            }`}
                    >
                        <span className="text-sm whitespace-nowrap">{user?.fullName}</span>
                        <span className="font-semibold text-xs text-pale-sky whitespace-nowrap">{user?.isDriver ? 'Driver' : 'Passenger'}</span>
                    </div>
                </div>
            )}
        </>
    )
}

export default AsideUser