import * as z from "zod";
import { IGender } from "@/types/User";
import { RideCriteria } from "@/types/Ride";

const optionalNumber = z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}, z.number()).optional();

const optionalDate = z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
        return undefined;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? undefined : value;
    }

    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}, z.date()).optional();

export const rideCriteriaSchema = z.object({
    startLatitude: optionalNumber,
    startLongitude: optionalNumber,
    endLatitude: optionalNumber,
    endLongitude: optionalNumber,
    seats: optionalNumber,
    departureTime: optionalDate,
    gender: z.enum(IGender).optional(),
}) satisfies z.ZodType<RideCriteria>;

export const createRideSchema = z.object({
    startAddress: z.string().min(1, "Address is required"),
    startLatitude: z.number(),
    startLongitude: z.number(),
    endAddress: z.string().min(1, "Address is required"),
    endLatitude: z.number(),
    endLongitude: z.number(),
    departureTime: z
        .string()
        .min(1, "Departure time is required")
        .refine((value) => !Number.isNaN(Date.parse(value)), {
            message: "Departure time must be a valid ISO string",
        }),
    totalSeats: z.number().min(1, "Total seats must be at least 1"),
    pricePerSeat: z.number().min(0, "Price per seat must be at least 0"),
    waitingTimeMinutes: z.number(),
    ridePreferences: z.object({
        musicAllowed: z.boolean(),
        noSmoking: z.boolean(),
        petsWelcomed: z.boolean(),
        openToConversation: z.boolean(),
    }),
});

export type CreateRideSchemaType = z.infer<typeof createRideSchema>;
export type RideCriteriaFormValues = z.infer<typeof rideCriteriaSchema>;