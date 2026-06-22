import Image from 'next/image'
import Link from 'next/link'
import { IRecentRideCard, RideStatus } from '@/types/Ride'
import { PoundSterling } from 'lucide-react';
import NULL_PROFILE_PICTURE from '@/assets/generic_profile_picture.png';
import { getRideStatusStyle } from '@/lib/services/rideService';

const RecentRideCard = ({ data }: { data: IRecentRideCard }) => {
    const rideStyle = getRideStatusStyle(data.rideStatus);
    return (
        <Link href={'#'} className='grid grid-cols-5 items-center gap-4 bg-background rounded-xl px-4 py-2'>
            {/* //? Driver Info */}
            <div className="flex gap-4">
                <picture className='size-12 overflow-hidden rounded-full flex justify-center items-center'>
                    <Image
                        src={data.driverPhoto ?? NULL_PROFILE_PICTURE}
                        alt='driver'
                        width={24}
                        height={24}
                        className='object-cover'
                    />
                </picture>
                <div>
                    <h4 className='font-semibold'>{data.driverName}</h4>
                    <p className='text-txt-secondary'>{new Date(data.rideDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                </div>
            </div>
            {/* //? Source --> Destination */}
            <div className="flex col-span-2 justify-start items-center text-txt-secondary gap-2">
                <i className="fa-solid fa-location-dot"/>
                <p>{data.rideSrc}</p>
                <i className="fa-solid fa-arrow-right"/>
                <p>{data.rideDest}</p>
            </div>
            {/* //? Ride Status */}
            <div className="flex justify-center text-sm">
                <span className={`${rideStyle} rounded-full py-1 px-2`}>{data.rideStatus}</span>
            </div>
            {/* //? Amount */}
            <span className='font-bold flex gap-1 justify-end-safe'>
                <p>{data.rideAmount}</p>
                <PoundSterling/>
            </span>
        </Link>
    )
}

export default RecentRideCard