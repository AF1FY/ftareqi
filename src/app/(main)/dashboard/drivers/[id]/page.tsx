"use client"
import { approveDriverAsync, getDriverByIdAsync } from '@/lib/actions/Moderator.actions';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react'
import CarDetails from '../../_components/CarDetails';
import DriverDetails from '../../_components/DriverDetails';
import { mapToCarDetails, mapToDriverDetails } from '@/lib/services/moderatorService';
import { CarDetailsType, DriverDetailsType } from '@/types/Moderator';
import { ProfileImageWithLightbox } from '../../_components/ProfileImageWithLightbox';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
const layout = () => {
    const path: string = usePathname();
    const [isCarDetaisShown, setIsCarDetaisShown] = useState(false);
    const [carDetails, setCarDetails] = useState<CarDetailsType>(mapToCarDetails());
    const [driverDetails, setDriverDetails] = useState<DriverDetailsType>(mapToDriverDetails());
    const [isPending, setIsPending] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const params = useParams();
    const id = Number(params.id);
    const router = useRouter();
    useQuery({
        queryKey: ['driverDetails'],
        queryFn: async () => {
            try {
                const res = await getDriverByIdAsync(id);
                if (res.success) {
                    setCarDetails(mapToCarDetails(res.data));
                    setDriverDetails(mapToDriverDetails(res.data));
                    return res.data;
                }
                throw new Error();
            } catch (e) {
                throw e;
            }
        },
    })
    //* Approval or Rejection
    async function handleApproval(isApproved: boolean) {
        setIsPending(true);
        isApproved ? setIsApproving(true) : setIsRejecting(true);
        const res = await approveDriverAsync(id, isApproved);
        if(res.success){
            toast.success(res.message , {position:'top-right'});
            router.refresh();
            setTimeout(() => {
                router.back();
            }, 1500);
        }
        else{
            toast.error(res.message ?? res.errors[0] ?? "Network error occurred")
        }
        setIsPending(false);
        isApproved ? setIsApproving(false) : setIsRejecting(false);
    }
    return (
        <div className='container p-8'>
            <div className='flex items-center gap-2 pb-6'>
                <Link className='text-pale-sky hover:text-dodger-blue' href={'/dashboard/drivers'}><i className="fa-solid fa-arrow-left text-xs"></i> Drivers</Link>
                <span>/</span>
                <span>Driver Profile</span>
            </div>
            <div className="flex justify-between items-center pb-8">
                {/*//* Profile picture and Name  */}
                <div className="flex items-center gap-4">
                    <ProfileImageWithLightbox
                        src={driverDetails.driverPhoto}
                        alt='driver profile picture'
                    />
                    <h2 className="text-xl font-bold">{driverDetails.fullName ?? 'Joe Doe'}</h2>
                </div>
                {/*//* Two buttons reject & approve */}
                <div className="flex justify-between items-center gap-4 font-bold">
                    <button disabled={isPending} onClick={() => handleApproval(false)} className='px-4 py-1.5 transition-all duration-300 rounded-2xl cursor-pointer bg-athens-gray hover:bg-red-200 dark:hover:bg-red-900'>
                        {isRejecting ? <Spinner className='size-6' /> : 'Reject'}
                    </button>
                    <button disabled={isPending} onClick={() => handleApproval(true)} className='px-4 py-1.5 transition-all duration-300 rounded-2xl cursor-pointer bg-royale-blue text-white hover:shadow-md hover:bg-royale-blue hover:scale-105'>
                        {isApproving ? <Spinner className='size-6' /> : 'Approve'}
                    </button>
                </div>
            </div>
            {/*//* Links   */}
            <div className="flex border-b border-athens-gray gap-8">
                <button onClick={() => setIsCarDetaisShown(false)} className={`py-4 px-1 border-dodger-blue font-medium cursor-pointer ${!isCarDetaisShown ? 'border-b-2 text-dodger-blue' : 'text-pale-sky'} `}>Driver Details</button>
                <button onClick={() => setIsCarDetaisShown(true)} className={`py-4 px-1 border-dodger-blue font-medium cursor-pointer ${isCarDetaisShown ? 'border-b-2 text-dodger-blue' : 'text-pale-sky'} `}>Car Details</button>
            </div>
            {/*//* Driver / Car details  */}
            {isCarDetaisShown ?
                <CarDetails carDetails={carDetails} /> :
                <DriverDetails driverDetails={driverDetails} />}
        </div>
    )
}

export default layout