'use client'
import ModernCarIcon from '@/components/svg/ModernCarIcon';
import { IRecentRideCard, RideStatus } from '@/types/Ride';
import Link from 'next/link';
import React, { useEffect } from 'react'
import RecentRideCard from './_components/RecentRideCard';

const recentRides: IRecentRideCard[] = [
    {
        driverName: 'أحمد محمد',
        rideDate: '2026-10-24 08:30 AM',
        rideSrc: 'ميدان التحرير، القاهرة',
        rideDest: 'مول العرب، 6 أكتوبر',
        rideStatus: RideStatus[0] ,
        rideAmount: '120.50'
    },
    {
        driverName: 'سارة علي',
        rideDate: '2026-10-23 05:15 PM',
        rideSrc: 'مدينة نصر',
        rideDest: 'التجمع الخامس',
        rideStatus: RideStatus[0] ,
        rideAmount: '60.00'
    },
    {
        driverName: 'محمود حسن',
        rideDate: '2023-10-22 09:00 PM',
        rideSrc: 'المعادي',
        rideDest: 'الزمالك',
        rideStatus: RideStatus[1] ,
        rideAmount: '45.00'
    }
];
const Home = () => {
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);
            },
            (error) => {
                console.error(error);
            }
        );
    }, [])

    return (
        <div className="bg-porcelain p-8 grid grid-cols-3 gap-x-8 min-h-screen">
            {/* //? Left side Quick Actions & Recent Rides */}
            <div className="col-span-2 gap-y-10 flex flex-col">
                {/*//? Quick Actions  */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-xl">Quick Actions</h3>
                    {/*//? Actions  */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* //? Offer Ride */}
                        <Link href={'#'} className='rounded-3xl py-5 bg-foreground text-background flex items-center justify-center'>
                            <div className="flex flex-col gap-1.5 justify-center items-center">
                                <ModernCarIcon size={20} />
                                <strong>Offer Ride</strong>
                            </div>
                        </Link>
                        {/* //? Find Ride */}
                        <Link href={'#'} className='bg-background hover:shadow-sm duration-200 transition-all rounded-3xl py-5 flex items-center justify-center'>
                            <div className="flex flex-col gap-1.5 justify-center items-center">
                                <i className="fa-solid fa-magnifying-glass-location text-xl" />
                                <strong>Find Ride</strong>
                            </div>
                        </Link>
                    </div>
                </div>
                {/* //? Recent Rides */}
                <div className="flex flex-col gap-4">
                    {/* //? Header */}
                    <div className="flex justify-between items-center">
                        <h3 className='font-bold text-xl'>Recent Rides</h3>
                        <Link href={'#'}>View All</Link>
                    </div>
                    {/* //? Recent Ride Cards */}
                    <div className="flex flex-col gap-4">
                        {recentRides.map(card => (<RecentRideCard data={card} key={card.driverName} />))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home