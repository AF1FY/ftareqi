'use client'
import { cn } from '@/lib/utils'
import { BookingStatus } from '@/types/Ride';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const layout = ({children}: {children: React.ReactNode}) => {
    const path: string = usePathname();
    console.log('Enum : ', BookingStatus.CancelledByDriver);
    
    return (
        <>
        <div
            className="inline-flex h-fit w-full items-center rounded-full bg-background p-1 shadow-sm"
        >
            <Link
                href={'/ride/trips/driver/my-trips'}
                className={cn(
                    "flex items-center justify-center w-1/2 rounded-full px-4 py-2 transition-all sm:px-6",
                    path.endsWith('/my-trips')
                        ? "bg-dodger-blue-dark text-white shadow"
                        : "text-muted-foreground hover:text-foreground",
                )}
            >
                Upcoming Trips
            </Link>
            <Link
                href={'/ride/trips/driver/past'}
                className={cn(
                    "flex items-center justify-center w-1/2 rounded-full px-4 py-2 transition-all sm:px-6",
                    path.endsWith('/past')
                        ? "bg-dodger-blue-dark text-white shadow"
                        : "text-muted-foreground hover:text-foreground",
                )}
            >
                Past Trips
            </Link>
            <Link
                href={'/ride/trips/driver/requests'}
                className={cn(
                    "flex items-center justify-center w-1/2 rounded-full px-4 py-2 transition-all sm:px-6",
                    path.endsWith('/requests')
                        ? "bg-dodger-blue-dark text-white shadow"
                        : "text-muted-foreground hover:text-foreground",
                )}
            >
                Requests
            </Link>
        </div>

        <div className="mt-6 px-1"> {children} </div>
        </>
    )
}

export default layout