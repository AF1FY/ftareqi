import { useEffect, useRef, useState } from 'react'
import {
    type UseFormReturn,
    useWatch,
} from "react-hook-form";
import { ChevronDown, LocateFixed, MapPin } from "lucide-react";
import { type MapboxFeature } from "@/lib/services/mapboxService";
import { CreateRideFormType } from '../create/page';
import { searchMapboxAddresses } from '@/lib/actions/Map.Actions';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

type AddressFieldName = "startAddress" | "endAddress";
type CoordinateFieldName =
    | "startLatitude"
    | "startLongitude"
    | "endLatitude"
    | "endLongitude";

type AddressSearchFieldProps = {
    form: UseFormReturn<CreateRideFormType>;
    name: AddressFieldName;
    latitudeName: CoordinateFieldName;
    longitudeName: CoordinateFieldName;
    label: string;
    placeholder: string;
    showCurrentLocationButton?: boolean;
    onUseCurrentLocation?: () => Promise<void>;
};

function AddressSearchField({
    form,
    name,
    latitudeName,
    longitudeName,
    label,
    placeholder,
    showCurrentLocationButton = false,
    onUseCurrentLocation,
}: AddressSearchFieldProps) {
    const addressValue = useWatch({ control: form.control, name });
    const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const searchTimeoutRef = useRef<number | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        abortControllerRef.current?.abort();

        const query = addressValue?.trim() ?? "";

        if (!isOpen || query.length < 2) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsSearching(true);
        searchTimeoutRef.current = window.setTimeout(async () => {
            try {
                const results = await searchMapboxAddresses(query, controller.signal);
                if (!controller.signal.aborted) {
                    setSuggestions(results);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Mapbox autocomplete failed:", error);
                    setSuggestions([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsSearching(false);
                }
            }
        }, 300);

        return () => {
            controller.abort();
            if (searchTimeoutRef.current) {
                window.clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [addressValue, isOpen]);

    const handleSelectSuggestion = (feature: MapboxFeature) => {
        form.setValue(name, feature.place_name, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        form.setValue(latitudeName, feature.center[1], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        form.setValue(longitudeName, feature.center[0], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="text-sm font-medium">
                {label}
            </label>

            <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground" />
                <Input
                    {...form.register(name)}
                    placeholder={placeholder}
                    onFocus={() => setIsOpen(true)}
                    onClick={() => setIsOpen(true)}
                    className="h-12 w-full rounded-lg border border-athens-gray dark:bg-black pl-12 pr-12 shadow-none transition-all focus-visible:ring focus-visible:ring-pale-sky"
                />
                {showCurrentLocationButton && onUseCurrentLocation ? (
                    <button
                        type="button"
                        onClick={onUseCurrentLocation}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-primary/80"
                        title="Use Current Location"
                    >
                        <LocateFixed className="h-5 w-5" />
                    </button>
                ) : null}
            </div>

            {isOpen ? (
                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-athens-gray bg-background shadow-xl">
                    <div className="flex items-center justify-between border-b border-athens-gray px-4 py-3 text-sm text-pale-sky">
                        <span>{isSearching ? "Searching places..." : "Suggestions"}</span>
                        {isSearching ? (
                            <Spinner className="size-4 text-primary" />
                        ) : (
                            <ChevronDown className="size-4" />
                        )}
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                        {isSearching ? (
                            <div className="px-3 py-4 text-sm text-pale-sky">
                                Loading locations...
                            </div>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((feature) => (
                                <button
                                    key={feature.id}
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSelectSuggestion(feature)}
                                    className="flex w-full flex-col rounded-lg px-3 py-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <span className="text-sm font-medium">
                                        {feature.place_name}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-sm text-pale-sky">
                                Start typing to search addresses.
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            <p className="mt-2 text-sm text-red-500">{form.formState.errors[name]?.message}</p>
        </div>
    );
}

export default AddressSearchField