"use client";

import { Flag, Navigation, Search, SlidersHorizontal, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RideCriteriaFormValues } from "../../../../lib/validators/ride.schema";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

type LeafletCoords = {
    lat: number;
    lng: number;
};

const egyptCenter: LeafletCoords = {
    lat: 26.8206,
    lng: 30.8025,
};

const LeafletMapPicker = dynamic(() => import("./LeafletMapPicker"), {
    ssr: false,
    loading: () => (
        <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-athens-gray bg-background">
            <Spinner className="size-5 text-primary" />
        </div>
    ),
});

interface SearchHeaderProps {
    onOpenFilters: () => void;
    fromInitialValue: string;
    toInitialValue: string;
    onFromPlaceChange: (value: string) => void;
    onToPlaceChange: (value: string) => void;
    onSearchSubmit: () => void;
}

export function SearchHeader({
    onOpenFilters,
    fromInitialValue,
    toInitialValue,
    onFromPlaceChange,
    onToPlaceChange,
    onSearchSubmit,
}: SearchHeaderProps) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<RideCriteriaFormValues>();

    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [mapField, setMapField] = useState<"start" | "end" | null>(null);
    const [tempCoords, setTempCoords] = useState<LeafletCoords>(egyptCenter);
    const [tempAddress, setTempAddress] = useState("");

    const startLatitude = watch("startLatitude");
    const startLongitude = watch("startLongitude");
    const endLatitude = watch("endLatitude");
    const endLongitude = watch("endLongitude");

    const toCoords = (latitude: number | undefined, longitude: number | undefined): LeafletCoords | null => {
        if (typeof latitude !== "number" || typeof longitude !== "number") {
            return null;
        }

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
        }

        return { lat: latitude, lng: longitude };
    };

    const startCoords = useMemo(
        () => toCoords(startLatitude, startLongitude),
        [startLatitude, startLongitude]
    );

    const endCoords = useMemo(
        () => toCoords(endLatitude, endLongitude),
        [endLatitude, endLongitude]
    );

    const dynamicStartCoords =
        mapField === "start"
            ? tempCoords
            : startCoords;

    const dynamicEndCoords =
        mapField === "end"
            ? tempCoords
            : endCoords;

    const modalCoords =
        mapField === "start"
            ? tempCoords
            : mapField === "end"
                ? tempCoords
                : startCoords ?? endCoords ?? egyptCenter;

    const openMapForField = (field: "start" | "end") => {
        setMapField(field);

        if (field === "start" && startCoords) {
            setTempCoords(startCoords);
            setTempAddress(fromInitialValue);
        } else if (field === "end" && endCoords) {
            setTempCoords(endCoords);
            setTempAddress(toInitialValue);
        } else {
            setTempCoords(egyptCenter);
            setTempAddress("");
        }

        setIsMapModalOpen(true);
    };

    const handleConfirmMapSelection = () => {
        if (!mapField) {
            return;
        }

        if (mapField === "start") {
            setValue("startLatitude", tempCoords.lat, { shouldDirty: true, shouldTouch: true });
            setValue("startLongitude", tempCoords.lng, { shouldDirty: true, shouldTouch: true });
            onFromPlaceChange(tempAddress || fromInitialValue);
        }

        if (mapField === "end") {
            setValue("endLatitude", tempCoords.lat, { shouldDirty: true, shouldTouch: true });
            setValue("endLongitude", tempCoords.lng, { shouldDirty: true, shouldTouch: true });
            onToPlaceChange(tempAddress || toInitialValue);
        }

        setIsMapModalOpen(false);
        setMapField(null);
        onSearchSubmit();
    };

    return (
        <header className="pt-8 px-4 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
                <div className="hidden rounded-full border border-border bg-card/40 lg:flex lg:items-center">
                    <div className="flex flex-1 items-center gap-3 border-r border-border px-6 py-3.5">
                        <LocationAutocomplete
                            placeholder="Search pickup location"
                            icon={(<Navigation className="size-5 me-0.5 dark:text-dodger-blue" />)}
                            className="rounded-none border-0 bg-transparent p-0 w-full"
                            inputClassName="text-sm"
                            onOpenMap={() => openMapForField("start")}
                            initialValue={fromInitialValue}
                            onInputChange={(value) => {
                                onFromPlaceChange(value);
                                setValue("startLatitude", undefined, { shouldDirty: true, shouldTouch: true });
                                setValue("startLongitude", undefined, { shouldDirty: true, shouldTouch: true });
                            }}
                            onSelect={(latitude, longitude, placeName) => {
                                onFromPlaceChange(placeName);
                                setValue("startLatitude", latitude, { shouldDirty: true, shouldTouch: true });
                                setValue("startLongitude", longitude, { shouldDirty: true, shouldTouch: true });
                            }}
                        />
                    </div>

                    <div className="flex flex-1 items-center gap-3 border-r border-border px-6 py-3.5">
                        <LocationAutocomplete
                            placeholder="Search destination"
                            icon={(<Flag className="size-5 me-0.5 dark:text-dodger-blue" />)}
                            className="rounded-none border-0 bg-transparent p-0 w-full"
                            inputClassName="text-sm"
                            onOpenMap={() => openMapForField("end")}
                            initialValue={toInitialValue}
                            onInputChange={(value) => {
                                onToPlaceChange(value);
                                setValue("endLatitude", undefined, { shouldDirty: true, shouldTouch: true });
                                setValue("endLongitude", undefined, { shouldDirty: true, shouldTouch: true });
                            }}
                            onSelect={(latitude, longitude, placeName) => {
                                onToPlaceChange(placeName);
                                setValue("endLatitude", latitude, { shouldDirty: true, shouldTouch: true });
                                setValue("endLongitude", longitude, { shouldDirty: true, shouldTouch: true });
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex items-center rounded-e-full gap-2 bg-black px-8 py-3.5 text-white dark:bg-dodger-blue transition-opacity hover:opacity-90"
                    >
                        <Search className="h-5 w-5" />
                        <span>Search</span>
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-card lg:hidden">
                    <div className="border-b border-border px-4 py-3">
                        <LocationAutocomplete
                            placeholder="Leaving from..."
                            icon={(<Navigation className="w-5 h-5 text-[#1E90FF]" />)}
                            className="rounded-none border-0 bg-transparent p-0"
                            inputClassName="text-sm"
                            onOpenMap={() => openMapForField("start")}
                            initialValue={fromInitialValue}
                            onInputChange={(value) => {
                                onFromPlaceChange(value);
                                setValue("startLatitude", undefined, { shouldDirty: true, shouldTouch: true });
                                setValue("startLongitude", undefined, { shouldDirty: true, shouldTouch: true });
                            }}
                            onSelect={(latitude, longitude, placeName) => {
                                onFromPlaceChange(placeName);
                                setValue("startLatitude", latitude, { shouldDirty: true, shouldTouch: true });
                                setValue("startLongitude", longitude, { shouldDirty: true, shouldTouch: true });
                            }}
                        />
                    </div>

                    <div className="border-b border-border px-4 py-3">
                        <LocationAutocomplete
                            placeholder="Going to..."
                            icon={(<Flag className="w-5 h-5 text-[#1E90FF]" />)}
                            className="rounded-none border-0 bg-transparent p-0"
                            inputClassName="text-sm"
                            onOpenMap={() => openMapForField("end")}
                            initialValue={toInitialValue}
                            onInputChange={(value) => {
                                onToPlaceChange(value);
                                setValue("endLatitude", undefined, { shouldDirty: true, shouldTouch: true });
                                setValue("endLongitude", undefined, { shouldDirty: true, shouldTouch: true });
                            }}
                            onSelect={(latitude, longitude, placeName) => {
                                onToPlaceChange(placeName);
                                setValue("endLatitude", latitude, { shouldDirty: true, shouldTouch: true });
                                setValue("endLongitude", longitude, { shouldDirty: true, shouldTouch: true });
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-foreground dark:bg-dodger-blue text-white transition-opacity hover:opacity-90"
                    >
                        <Search className="h-5 w-5" />
                        <span>Search Rides</span>
                    </button>
                </div>

                {Object.keys(errors).length > 0 && (
                    <p className="text-xs text-red-500">Please check invalid form fields and try again.</p>
                )}
            </div>

            {isMapModalOpen && (
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
                                coords={modalCoords}
                                address={tempAddress}
                                startCoords={dynamicStartCoords}
                                endCoords={dynamicEndCoords}
                                onCoordsChange={setTempCoords}
                                onAddressChange={setTempAddress}
                                showCurrentLocationButton={true}
                                activeField={mapField}
                            />

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row justify-end-safe">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsMapModalOpen(false);
                                        setMapField(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                type="button"
                                onClick={handleConfirmMapSelection}
                                className="bg-foreground text-white dark:bg-dodger-blue"
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>)}
        </header>
    );
}