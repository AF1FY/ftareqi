"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
    Controller,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Info, Map, X } from "lucide-react";
import { format } from "date-fns";
import {
    createRideSchema,
    type CreateRideSchemaType,
} from "@/lib/validators/ride.schema";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    calculateTripCost,
    getRouteDistanceKilometers,
    reverseGeocodeMapbox
} from "@/lib/actions/Map.Actions";
import { createRideAsync, getNumOfSeatsAsync } from "@/lib/actions/Ride.actions";
import AddressSearchField from "../_components/AddressSearchField";
import { getShortAddress } from "@/lib/services/mapboxService";
import { toast } from "sonner";

type LeafletCoords = {
    lat: number;
    lng: number;
};

const LeafletMapPicker = dynamic(
    () => import("../_components/LeafletMapPicker"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-athens-gray bg-background">
                <Spinner className="size-5 text-primary" />
            </div>
        ),
    }
);

const egyptCenter: LeafletCoords = {
    lat: 26.8206,
    lng: 30.8025,
};

const createRideFormSchemaBase = createRideSchema
    .omit({ departureTime: true })
    .extend({
        departureDate: z.string().min(1, "Date is required"),
        departureClockTime: z.string().min(1, "Time is required"),
    })
    .refine(
        (data) =>
            !Number.isNaN(
                new Date(`${data.departureDate}T${data.departureClockTime}`).getTime()
            ),
        {
            message: "Please provide a valid date and time",
            path: ["departureClockTime"],
        }
    );

export type CreateRideFormType = z.infer<typeof createRideFormSchemaBase>;


const fieldBaseClassName =
    "h-12 rounded-lg border border-athens-gray dark:bg-black focus:outline-none";

const CreateTrip = () => {
    const router = useRouter();
    const [routeDistanceKm, setRouteDistanceKm] = useState<number | null>(null);
    const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
    const [maxSeatPrice, setMaxSeatPrice] = useState(0);
    const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [maxSeats, setMaxSeats] = useState<number>(4);
    const [tempCoords, setTempCoords] = useState<LeafletCoords>(egyptCenter);
    const [tempAddress, setTempAddress] = useState("");

    const form = useForm<CreateRideFormType>({
        mode: "onSubmit",
        resolver: zodResolver(createRideFormSchemaBase),
        defaultValues: {
            startAddress: "",
            startLatitude: undefined,
            startLongitude: undefined,
            endAddress: "",
            endLatitude: undefined,
            endLongitude: undefined,
            departureDate: "",
            departureClockTime: "",
            totalSeats: 1,
            pricePerSeat: undefined,
            waitingTimeMinutes: 15,
            ridePreferences: {
                musicAllowed: true,
                noSmoking: false,
                petsWelcomed: false,
                openToConversation: true,
            },
        },
    });

    const startLatitude = form.watch("startLatitude");
    const startLongitude = form.watch("startLongitude");
    const endLatitude = form.watch("endLatitude");
    const endLongitude = form.watch("endLongitude");
    const currentPrice = form.watch("pricePerSeat");
    const departureClockTime = form.watch("departureClockTime");
    const waitingTimeMinutes = form.watch("waitingTimeMinutes");

    const startCoords =
        Number.isFinite(startLatitude) && Number.isFinite(startLongitude)
            ? { lat: startLatitude, lng: startLongitude }
            : null;

    const endCoords =
        Number.isFinite(endLatitude) && Number.isFinite(endLongitude)
            ? { lat: endLatitude, lng: endLongitude }
            : null;

    const hasValidCoordinates = [
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
    ].every((value) => Number.isFinite(value));

    const isPriceDisabled = isCalculatingRoute || routeDistanceKm === null;

    const arrivalGuidanceTime = (() => {
        if (!departureClockTime || typeof waitingTimeMinutes !== "number") {
            return null;
        }

        const [hoursText, minutesText] = departureClockTime.split(":");
        const hours = Number(hoursText);
        const minutes = Number(minutesText);

        if (
            !Number.isFinite(hours) ||
            !Number.isFinite(minutes) ||
            !Number.isFinite(waitingTimeMinutes)
        ) {
            return null;
        }

        const departureDateTime = new Date();
        departureDateTime.setHours(hours, minutes, 0, 0);

        const arrivalDateTime = new Date(
            departureDateTime.getTime() - waitingTimeMinutes * 60 * 1000
        );

        return format(arrivalDateTime, "h:mm a");
    })();

    useEffect(() => {
        let isMounted = true;

        const loadMaxSeats = async () => {
            try {
                const seats = await getNumOfSeatsAsync();
                if (isMounted && Number.isFinite(seats) && seats > 0) {
                    setMaxSeats(seats);
                    if (form.getValues("totalSeats") > seats) {
                        form.setValue("totalSeats", seats, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load max seats:", error);
            }
        };

        void loadMaxSeats();

        return () => {
            isMounted = false;
        };
    }, [form]);

    useEffect(() => {
        const controller = new AbortController();

        if (!hasValidCoordinates) {
            setRouteDistanceKm(null);
            setSuggestedPrice(null);
            setMaxSeatPrice(0);
            setIsCalculatingRoute(false);
            form.clearErrors("pricePerSeat");
            return () => controller.abort();
        }

        setIsCalculatingRoute(true);

        const loadRouteDistance = async () => {
            try {
                const distanceKm = await getRouteDistanceKilometers(
                    startLatitude,
                    startLongitude,
                    endLatitude,
                    endLongitude,
                    controller.signal
                );

                if (controller.signal.aborted || distanceKm === null) {
                    return;
                }

                const { maxPrice: calculatedMaxPrice, suggestedPrice: nextSuggestedPrice } = await calculateTripCost(distanceKm);

                setRouteDistanceKm(distanceKm);
                setSuggestedPrice(nextSuggestedPrice);
                setMaxSeatPrice(calculatedMaxPrice);

                form.setValue("pricePerSeat", nextSuggestedPrice, {
                    shouldValidate: true,
                });
                form.clearErrors("pricePerSeat");
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Failed to calculate route distance:", error);
                    setRouteDistanceKm(null);
                    setSuggestedPrice(null);
                    setMaxSeatPrice(0);
                    form.setError("pricePerSeat", {
                        type: "manual",
                        message: "Unable to calculate route distance right now.",
                    });
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsCalculatingRoute(false);
                }
            }
        };

        void loadRouteDistance();

        return () => controller.abort();
    }, [
        form,
        hasValidCoordinates,
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
    ]);

    useEffect(() => {
        if (!isMapModalOpen) {
            return;
        }

        const isUsingDefaultCenter =
            tempCoords.lat === egyptCenter.lat && tempCoords.lng === egyptCenter.lng;

        if (!isUsingDefaultCenter || !navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setTempCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                // Keep the Egypt fallback if location access is denied.
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    }, [isMapModalOpen, tempCoords.lat, tempCoords.lng]);

    useEffect(() => {
        if (typeof currentPrice !== "number" || !Number.isFinite(currentPrice)) {
            form.clearErrors("pricePerSeat");
            return;
        }

        if (maxSeatPrice > 0 && currentPrice > maxSeatPrice) {
            form.setError("pricePerSeat", {
                type: "manual",
                message: `Maximum allowed price is ${maxSeatPrice} EGP`,
            });
            return;
        }

        form.clearErrors("pricePerSeat");
    }, [currentPrice, form, maxSeatPrice]);

    const handleUseCurrentLocation = async () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    form.setValue("startLatitude", latitude, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                    });
                    form.setValue("startLongitude", longitude, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                    });

                    const address = await reverseGeocodeMapbox(latitude, longitude);
                    if (address) {
                        form.setValue("startAddress", address, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                        });
                    }
                } catch (error) {
                    console.error("Failed to resolve current location:", error);
                }
            },
            (error) => {
                console.error("Unable to get current position:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const handleCommitMapSelection = (target: "start" | "destination") => {
        const latitudeField = target === "start" ? "startLatitude" : "endLatitude";
        const longitudeField = target === "start" ? "startLongitude" : "endLongitude";
        const addressField = target === "start" ? "startAddress" : "endAddress";

        form.setValue(latitudeField, tempCoords.lat, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        form.setValue(longitudeField, tempCoords.lng, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        form.setValue(addressField, tempAddress || form.getValues(addressField), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const onSubmit = async (values: CreateRideFormType) => {
        const { departureDate, departureClockTime, ...rest } = values;

        const departureTime = new Date(
            `${departureDate}T${departureClockTime}`
        ).toISOString();

        const payload: CreateRideSchemaType = {
            ...rest,
            startAddress: getShortAddress(rest.startAddress),
            endAddress: getShortAddress(rest.endAddress),
            departureTime,
        };
        const response = await createRideAsync(payload);

        if (!response.success) {
            toast.error(response.message ?? "Failed to create trip.", {
                position: "top-right",
                duration: 4000,
            });
            return;
        }

        toast.success(response.message ?? "Trip created successfully.", {
            position: "top-right",
            duration: 2200,
        });

        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        router.push("/home");
    };

    return (
        <div className="flex-1 full-scn overflow-y-auto md:p-4">
            <div className="mx-auto max-w-6xl">
                <div className="mb-4">
                    <h2 className="text-4xl font-black tracking-tighter">
                        Create a Trip
                    </h2>
                    <p className="mt-2 ms-1 text-base font-normal text-txt-secondary">
                        Fill in the details to create your trip
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="flex flex-col gap-8">
                            <div className="rounded-xl bg-background dark:bg-storm-cloud/10 p-6 shadow-sm">
                                <h3 className="mb-4 text-xl font-bold">
                                    Route
                                </h3>
                                <div className="flex flex-col gap-6">
                                    <AddressSearchField
                                        form={form}
                                        name="startAddress"
                                        latitudeName="startLatitude"
                                        longitudeName="startLongitude"
                                        label="From"
                                        placeholder="Search starting address"
                                        showCurrentLocationButton
                                        onUseCurrentLocation={handleUseCurrentLocation}
                                    />

                                    <AddressSearchField
                                        form={form}
                                        name="endAddress"
                                        latitudeName="endLatitude"
                                        longitudeName="endLongitude"
                                        label="To"
                                        placeholder="Search destination address"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setIsMapModalOpen(true)}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-pale-sky/10 font-bold transition-all hover:bg-pale-sky/20"
                                    >
                                        <Map className="h-5 w-5" />
                                        <span>Pick on Map</span>
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl bg-background dark:bg-storm-cloud/10 p-6 shadow-sm">
                                <h3 className="mb-4 text-xl font-bold">
                                    Trip Preferences
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-txt-secondary">
                                            Music allowed
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <Controller
                                                control={form.control}
                                                name="ridePreferences.musicAllowed"
                                                render={({ field }) => (
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="peer sr-only"
                                                    />
                                                )}
                                            />
                                            <div className="h-6 w-11 rounded-full bg-pale-sky/20 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-txt-secondary">
                                            No smoking
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <Controller
                                                control={form.control}
                                                name="ridePreferences.noSmoking"
                                                render={({ field }) => (
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="peer sr-only"
                                                    />
                                                )}
                                            />
                                            <div className="h-6 w-11 rounded-full bg-pale-sky/20 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-txt-secondary">
                                            Pets welcome
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <Controller
                                                control={form.control}
                                                name="ridePreferences.petsWelcomed"
                                                render={({ field }) => (
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="peer sr-only"
                                                    />
                                                )}
                                            />
                                            <div className="h-6 w-11 rounded-full bg-pale-sky/20 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-txt-secondary">
                                            Open to conversation
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <Controller
                                                control={form.control}
                                                name="ridePreferences.openToConversation"
                                                render={({ field }) => (
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="peer sr-only"
                                                    />
                                                )}
                                            />
                                            <div className="h-6 w-11 rounded-full bg-pale-sky/20 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-background dark:bg-storm-cloud/10 p-6 shadow-sm">
                            <h3 className="mb-4 text-xl font-bold">
                                Trip Details
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-txt-secondary">
                                            Date
                                        </label>
                                        <Controller
                                            control={form.control}
                                            name="departureDate"
                                            render={({ field }) => {
                                                const selectedDate = field.value
                                                    ? new Date(`${field.value}T00:00:00`)
                                                    : undefined;

                                                return (
                                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className={`${fieldBaseClassName} w-full justify-between px-4 font-normal ${!field.value ? "text-txt-secondary" : ""}`}
                                                            >
                                                                {field.value
                                                                    ? format(selectedDate as Date, "dd/MM/yyyy")
                                                                    : "Pick a date"}
                                                                <CalendarIcon className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            align="start"
                                                            className="w-auto p-0 dark:bg-black"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={selectedDate}
                                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                                onSelect={(date) => {
                                                                    field.onChange(
                                                                        date
                                                                            ? format(date, "yyyy-MM-dd")
                                                                            : ""
                                                                    );
                                                                    setIsCalendarOpen(false);
                                                                }}
                                                                autoFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                );
                                            }}
                                        />
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.departureDate?.message}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-txt-secondary">
                                            Time
                                        </label>
                                        <Input
                                            type="time"
                                            {...form.register("departureClockTime")}
                                            className={`${fieldBaseClassName} px-4`}
                                        />
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.departureClockTime?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-txt-secondary">
                                            Available Seats
                                        </label>
                                        <Controller
                                            control={form.control}
                                            name="totalSeats"
                                            render={({ field }) => (
                                                <Select
                                                    value={String(field.value ?? "")}
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                >
                                                    <SelectTrigger className={`${fieldBaseClassName} w-full px-4`}>
                                                        <SelectValue placeholder="Select seats" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-athens-gray dark:bg-black px-2">
                                                        {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
                                                            <SelectItem key={n} value={String(n)}>
                                                                {n} {n === 1 ? "Seat" : "Seats"}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.totalSeats?.message}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-txt-secondary">
                                            Price per Seat
                                        </label>
                                        <div
                                            className="relative"
                                            title={
                                                isPriceDisabled
                                                    ? "Please select start and destination to unlock pricing"
                                                    : undefined
                                            }
                                        >
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                disabled={isPriceDisabled}
                                                {...form.register("pricePerSeat", {
                                                    valueAsNumber: true,
                                                })}
                                                className={`${fieldBaseClassName} w-full px-4 pr-14 disabled:cursor-not-allowed disabled:opacity-50`}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                                                EGP
                                            </span>
                                        </div>
                                        <p className="text-sm text-pale-sky">
                                            {isCalculatingRoute
                                                ? "Calculating route distance..."
                                                : routeDistanceKm !== null &&
                                                    suggestedPrice !== null &&
                                                    maxSeatPrice > 0
                                                    ? `Suggested: ${suggestedPrice} EGP | Max limit: ${maxSeatPrice} EGP`
                                                    : "Select start and destination to calculate pricing."}
                                        </p>
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.pricePerSeat?.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-txt-secondary">
                                        Waiting Time
                                    </label>
                                    <Controller
                                        control={form.control}
                                        name="waitingTimeMinutes"
                                        render={({ field }) => (
                                            <Select
                                                value={String(field.value ?? "")}
                                                onValueChange={(value) => field.onChange(Number(value))}
                                            >
                                                <SelectTrigger className={`${fieldBaseClassName} w-full px-4`}>
                                                    <SelectValue placeholder="Select waiting time" />
                                                </SelectTrigger>
                                                <SelectContent className="border-athens-gray dark:bg-black px-2">
                                                    <SelectItem value="15">15 minutes</SelectItem>
                                                    <SelectItem value="30">30 minutes</SelectItem>
                                                    <SelectItem value="45">45 minutes</SelectItem>
                                                    <SelectItem value="60">1 hour</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.waitingTimeMinutes?.message}
                                    </p>

                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-out ${arrivalGuidanceTime ? "mt-1 max-h-24 translate-y-0 opacity-100 p-1" : "max-h-0 -translate-y-1 opacity-0 px-3 py-0"}`}
                                    >
                                        <p className="text-sm text-txt-secondary flex items-center gap-2">
                                            <Info className="inline" size={16} />
                                            You are required to be at the starting point by
                                            <span className="font-semibold"> {arrivalGuidanceTime ?? ""}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="h-14 w-full max-w-sm rounded-xl bg-foreground font-bold text-background shadow-lg transition-all hover:scale-[1.02] hover:bg-foreground/90 active:scale-[0.98]"
                        >
                            {form.formState.isSubmitting ? "Creating Trip..." : "Create Trip"}
                        </button>
                    </div>
                </form>
            </div>

            {isMapModalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsMapModalOpen(false)}>
                    <div onClick={(e) => { e.stopPropagation() }} className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-background dark:bg-black shadow-2xl">
                        <div className="flex items-center justify-between border-b border-athens-gray px-5 py-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Pick on Map
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMapModalOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pale-sky/10 transition-colors hover:bg-pale-sky/20"
                                aria-label="Close map modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-5">
                            <LeafletMapPicker
                                coords={tempCoords}
                                address={tempAddress}
                                startCoords={startCoords}
                                endCoords={endCoords}
                                onCoordsChange={setTempCoords}
                                onAddressChange={setTempAddress}
                            />

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => handleCommitMapSelection("start")}
                                    className="flex h-12 flex-1 py-2 items-center justify-center rounded-xl bg-foreground font-bold text-background transition-all hover:bg-primary/90"
                                >
                                    Set as Start
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCommitMapSelection("destination")}
                                    className="flex h-12 flex-1 py-2 items-center justify-center rounded-xl bg-dodger-blue font-bold text-white transition-all hover:bg-dodger-blue/90"
                                >
                                    Set as Destination
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CreateTrip;