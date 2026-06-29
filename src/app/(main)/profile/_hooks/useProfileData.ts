import { useQuery } from "@tanstack/react-query";
import {
    getDriverCarAsync,
    getDriverDetails,
    getProfileAsync,
} from "@/lib/actions/Profile.actions";
import { CarDetails, DriverDetails } from "@/types/Driver";
import { IProfile } from "@/types/Profile";

export const useProfileData = () =>
    useQuery<IProfile | null>({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await getProfileAsync();

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to load profile information.",
                );
            }

            return response.data ?? null;
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

export const useDriverProfileData = () =>
    useQuery<{
        driverDetails: DriverDetails | null;
        carDetails: CarDetails | null;
    }>({
        queryKey: ["driver-profile-data"],
        queryFn: async () => {
            const [driverResponse, carResponse] = await Promise.all([
                getDriverDetails(),
                getDriverCarAsync(),
            ]);

            return {
                driverDetails: driverResponse.success
                    ? (driverResponse.data ?? null)
                    : null,
                carDetails: carResponse.success
                    ? (carResponse.data ?? null)
                    : null,
            };
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
