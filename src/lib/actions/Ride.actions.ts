'use server'
import { DriverPastRide, DriverRequests, DriverUpcomingRides, RideBookingRequestDto, RiderTrip, RiderUpcomingTripRequestDTO, RideSearchRequestDto, RideSearchResposneDto } from "@/types/Ride";
import { CreateRideSchemaType } from "../validators/ride.schema";
import { getDataAsync, getPaginatedDataAsync, postDataAsync } from "./Base.actions";
import { getDriverCarAsync } from "./Profile.actions"
import { PaginatedData } from "@/types/Moderator";
import { PaginatedReq } from "@/types/Auth";

const RIDE_API = 'api/rides';
const BOOKING_API = 'api/ride-bookings'

export async function getNumOfSeatsAsync(): Promise<number> {
    try {
        const res = await getDriverCarAsync();
        if (res.success)
            return res.data?.numOfSeats ?? 3;
        throw new Error(res.message ?? res.errors[0] ?? 'Error in Fetching Number of seats.');
    } catch (e: any) {
        console.error(e.response?.data?.message);
        return 3;
    }
}

export const createRideAsync = async (body: CreateRideSchemaType) => postDataAsync<null, CreateRideSchemaType>(RIDE_API, body, 'Failed to create ride');

const buildSearchRideQueryParams = (request: RideSearchRequestDto) => {
    const queryParams: Record<string, string | number | boolean | undefined> = {
        Page: request.Page ?? 1,
        PageSize: request.PageSize ?? 10,
        SortDescending: request.SortDescending,
        Filters: request.filters,
    };

    const criteria = request.criteria;

    if (criteria) {
        queryParams["Criteria.StartLatitude"] = criteria.startLatitude;
        queryParams["Criteria.StartLongitude"] = criteria.startLongitude;
        queryParams["Criteria.EndLatitude"] = criteria.endLatitude;
        queryParams["Criteria.EndLongitude"] = criteria.endLongitude;
        queryParams["Criteria.Seats"] = criteria.seats;
        queryParams["Criteria.DepartureTime"] = criteria.departureTime?.toISOString();
        queryParams["Criteria.Gender"] = criteria.gender;
    }

    return queryParams;
};

export const searchRidesAsync = async (params: RideSearchRequestDto) =>
    getPaginatedDataAsync<RideSearchResposneDto, Record<string, string | number | boolean | undefined>>(
        `${RIDE_API}/search`,
        undefined,
        'Failed to search',
        [],
        buildSearchRideQueryParams(params)
    );

export const bookRideAsync = async (rideId: number, numberOfSeats: number) => 
    postDataAsync<undefined, {rideId: number, numberOfSeats: number}>(BOOKING_API, {rideId, numberOfSeats}, 'Failed to book a ride.');

//? Get upcoming rides for driver
export const getDriverUpcomingRidesAsync = async (params: PaginatedReq) => 
    getDataAsync<PaginatedData<DriverUpcomingRides>, PaginatedReq>(`${RIDE_API}/driver/upcoming` , undefined , 'Failed to get upcoming rides for driver' , [] , params);

//? Get past rides for driver
export const getDriverPastRidesAsync = async (params: PaginatedReq) => 
    getDataAsync<PaginatedData<DriverPastRide>, PaginatedReq>(`${RIDE_API}/driver/past` , undefined , 'Failed to get past rides for driver' , [] , params);

//! Canceling Ride as a driver
export const cancelRideAsync = async (rideId: number) => postDataAsync<undefined, { rideId: number }>(`${RIDE_API}/${rideId}/cancel`, undefined, 'Failed to cancel ride', { rideId });

//? Get rides requests for driver
export const getDriverRideRequestsAsync = async (params: RideBookingRequestDto) => 
    getDataAsync<PaginatedData<DriverRequests>, RideBookingRequestDto>(`${BOOKING_API}/driver/requests`, undefined, 'Failed to get ride requests for driver', [], params);

//? Accept Rider request for a ride as a driver
export const acceptRideRequestAsync = async (bookingId: number) =>
    postDataAsync<undefined, { bookingId: number }>(`${BOOKING_API}/${bookingId}/accept`, undefined, 'Failed to accept ride request', { bookingId });

//! Decline Rider request for a ride as a driver
export const declineRideRequestAsync = async (bookingId: number) =>
    postDataAsync<undefined, { bookingId: number }>(`${BOOKING_API}/${bookingId}/decline`, undefined, 'Failed to decline ride request', { bookingId });

//? Get rider upcoming trips
export const getRiderUpcomingTripsAsync = async (params: RiderUpcomingTripRequestDTO) =>
    getDataAsync<PaginatedData<RiderTrip>, RiderUpcomingTripRequestDTO>(`${BOOKING_API}/user/upcoming`, undefined, 'Failed to fetch rider upcoming trips', [], params);

//! Cancels booked trip by rider
export const cancelRiderTripAsync = async (bookingId: number) => 
    postDataAsync<undefined, { bookingId: number }>(`${BOOKING_API}/${bookingId}/cancel`, undefined, 'Failed to cancel trip', { bookingId })

//? get rider past trips
export const getRiderPastTripsAsync = async (params: PaginatedReq) =>
    getDataAsync<PaginatedData<RiderTrip>, PaginatedReq>(`${BOOKING_API}/user/history`, undefined, 'Failed to fetch rider past trips', [], params);
