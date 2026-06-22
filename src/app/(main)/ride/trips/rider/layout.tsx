'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const layout = ({children}: {children: React.ReactNode}) => {
    const path: string = usePathname();

    return (
        <>
        <div
            className="inline-flex h-fit items-center rounded-full bg-background p-1 shadow-sm w-full"
        >
            <Link
                href={'/ride/trips/rider/upcoming'}
                className={cn(
                    "flex items-center justify-center w-1/2 rounded-full px-4 py-2 transition-all sm:px-6",
                    path.endsWith('/upcoming')
                        ? "bg-dodger-blue-dark text-white shadow"
                        : "text-muted-foreground hover:text-foreground",
                )}
            >
                Upcoming Rides
            </Link>
            <Link
                href={'/ride/trips/rider/history'}
                className={cn(
                    "flex items-center justify-center w-1/2 rounded-full px-4 py-2 transition-all sm:px-6",
                    path.endsWith('/history')
                        ? "bg-dodger-blue-dark text-white shadow"
                        : "text-muted-foreground hover:text-foreground",
                )}
            >
                Past Rides
            </Link>
        </div>

        <div className="mt-6 px-1"> {children} </div>
        </>
    )
}

export default layout