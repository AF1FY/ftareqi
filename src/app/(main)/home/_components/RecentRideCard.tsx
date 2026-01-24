import Image from 'next/image'
import Link from 'next/link'
import { IRecentRideCard, RideStatusStyle } from '@/types/Ride'
import { PoundSterling } from 'lucide-react';
import NULL_PROFILE_PICTURE from '@/assets/generic_profile_picture.png';

const RecentRideCard = ({ data }: { data: IRecentRideCard }) => {
    const rideStyle = RideStatusStyle[data.rideStatus] || 'bg-gray-100 text-gray-600';
    return (
        <Link href={'#'} className='flex justify-between gap-4 items-center bg-background rounded-xl px-4 py-2'>
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
            <div className="flex justify-between items-center text-txt-secondary gap-2">
                <i className="fa-solid fa-location-dot"/>
                <p>{data.rideSrc}</p>
                <i className="fa-solid fa-arrow-right"/>
                <p>{data.rideDest}</p>
            </div>
            {/* //? Ride Status */}
            <span className={`${rideStyle} rounded-full py-1 px-2`}>{data.rideStatus}</span>
            {/* //? Amount */}
            <span className='font-bold flex gap-1'>
                <p>{data.rideAmount}</p>
                <PoundSterling/>
            </span>
        </Link>
    )
}

export default RecentRideCard