import { CreateRideSchemaType } from "@/lib/validators/ride.schema";
import { PaginatedReq } from "./Auth";
import { IGender } from "./User";

export interface IRecentRideCard {
    driverPhoto?: string;
    driverName: string;
    rideDate: string;
    rideSrc: string;
    rideDest: string;
    rideStatus: RideStatus;
    rideAmount: string;
}
export enum RideStatus {
    Scheduled = 'Scheduled',
    InProgress = 'In Progress',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export enum RideField {
    Cheapest = "Cheapest",
    HighestRate = "HighestRate"
}

export interface RideCriteria {
    startLatitude?: number;
    startLongitude?: number;
    endLatitude?: number;
    endLongitude?: number;
    seats?: number;
    departureTime?: Date;
    gender?: IGender;
}

export interface RideSearchRequestDto extends PaginatedReq {
    criteria?: RideCriteria;
    filters?: RideField;
}

export enum RidePreferencesEnum {
    musicAllowed = 'musicAllowed',
    noSmoking = 'noSmoking',
    petsWelcomed = 'petsWelcomed',
    openToConversation = 'openToConversation'
}

export interface TripPreferences {
    musicAllowed: boolean;
    noSmoking: boolean;
    petsWelcomed: boolean;
    openToConversation: boolean;
}

export interface RideSearchResposneDto extends Omit<CreateRideSchemaType, 'totalSeats' | 'waitingTimeMinutes' | 'ridePreferences'>, TripPreferences {
    rideId: number;
    driverUserId?: number;
    availableSeats: number;
    status: RideStatus;
    driverRate: number;
    driverName: string;
    driverImgUrl: string;
}

export interface DriverUpcomingRides extends Omit<RideSearchResposneDto, 'driverUserId' | 'driverRate' | 'driverName' | 'driverImgUrl'> {
    waitingTimeMinutes: number;
    totalSeats: number;
}

export interface DriverPastRide extends Omit<DriverUpcomingRides, 'waitingTimeMinutes' | 'availableSeats' | 'totalSeats' | 'openToConversation' | 'petsWelcomed' | 'noSmoking' | 'musicAllowed' | 'pricePerSeat'> {
    takenSeats: number;
    totalEarnings: number;
    averageRating: number;
}

//? Ride Booking

export enum BookingStatus {
    Pending = 'Pending',
    CancelledByRider = 'Cancelled By Rider',
    CancelledByDriver = 'Cancelled By Driver',
    Accepted = 'Accepted',
    Expired = 'Expired'
}

export interface DriverRequests {
    bookingId: number,
    rideId: number,
    riderUserId: string,
    riderName: string,
    requestedSeats: number,
    totalAmount: number,
    status: BookingStatus,
    requestedAt: string,
    departureTime: string,
    startAddress: string,
    endAddress: string
}

export interface RideBookingRequestDto extends PaginatedReq {
    FilterBy?: BookingStatus
}

export interface RiderTrip extends 
    TripPreferences, 
    Pick<DriverRequests, 'bookingId' | 'rideId' | 'status' | 'totalAmount' | 'departureTime' | 'startAddress' | 'endAddress'>,
    Required<Pick<RideCriteria, 'startLatitude' | 'startLongitude' | 'endLatitude' | 'endLongitude'>> 
{
    bookedAt: string;
    seats: number;
    driverName: string;
    driverUserId: string;
    driverImg: string;
}

export interface RiderUpcomingTripRequestDTO extends PaginatedReq {
    FilterBy?: 'Accepted' | 'Pending'
}