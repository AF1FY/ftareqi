export interface IRecentRideCard{
    driverPhoto?:string,
    driverName: string,
    rideDate: string,
    rideSrc: string,
    rideDest: string,
    rideStatus: string,
    rideAmount: string
}
export enum RideStatus{
    Pending,
    Completed
}

export const RideStatusStyle: Record<string, string> = {
    [RideStatus[0]]: 'bg-pending text-pending-t',
    [RideStatus[1]]: 'bg-approved text-approved-t',
}