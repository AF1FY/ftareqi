"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, Map } from "lucide-react";
import { searchMapboxAddresses } from "@/lib/actions/Map.Actions";
import { MapboxFeature } from "@/lib/services/mapboxService";
import { cn } from "@/lib/utils";

interface LocationAutocompleteProps {
    icon?: React.ReactElement;
    placeholder: string;
    onSelect: (latitude: number, longitude: number, placeName: string) => void;
    onInputChange?: (value: string) => void;
    onOpenMap?: () => void;
    initialValue?: string;
    className?: string;
    inputClassName?: string;
}

export function LocationAutocomplete({
    icon = <MapPin className="size-4 shrink-0 text-dodger-blue" />,
    placeholder,
    onSelect,
    onInputChange,
    onOpenMap,
    initialValue = "",
    className,
    inputClassName,
}: LocationAutocompleteProps) {
    const [query, setQuery] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const justSelectedRef = useRef(false);
    const selectedValueRef = useRef<string | null>(null);

    useEffect(() => { setQuery(initialValue); }, [initialValue]);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const trimmedQuery = useMemo(() => query.trim(), [query]);
    useEffect(() => {
        if (trimmedQuery.length < 2 || trimmedQuery === selectedValueRef.current) {
            setSuggestions([]); setActiveIndex(-1); setFetchError(null); setIsLoading(false); return;
        }
        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            try {
                setIsLoading(true); setFetchError(null);
                const results = await searchMapboxAddresses(trimmedQuery, controller.signal);
                setSuggestions(results); setActiveIndex(results.length > 0 ? 0 : -1); setIsOpen(true);
            } catch (error) { if (!controller.signal.aborted) { setFetchError("Error"); setSuggestions([]); setActiveIndex(-1); } }
            finally { if (!controller.signal.aborted) setIsLoading(false); }
        }, 400);
        return () => { window.clearTimeout(timeout); controller.abort(); };
    }, [trimmedQuery]);

    const handleSelect = (feature: MapboxFeature) => {
        const latitude = feature.center[1]; const longitude = feature.center[0];
        justSelectedRef.current = true; selectedValueRef.current = feature.place_name;
        setQuery(feature.place_name); setSuggestions([]); setActiveIndex(-1); setFetchError(null);
        onSelect(latitude, longitude, feature.place_name); setIsOpen(false); inputRef.current?.blur();
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            if (suggestions.length > 0) setIsOpen(true);
            return;
        }

        if (event.key === "ArrowDown") {
            if (suggestions.length === 0) return;
            event.preventDefault();
            setActiveIndex((previous) => (previous + 1) % suggestions.length);
            return;
        }

        if (event.key === "ArrowUp") {
            if (suggestions.length === 0) return;
            event.preventDefault();
            setActiveIndex((previous) =>
                previous <= 0 ? suggestions.length - 1 : previous - 1,
            );
            return;
        }

        if (event.key === "Enter") {
            if (!isOpen || suggestions.length === 0 || activeIndex < 0) return;
            event.preventDefault();
            handleSelect(suggestions[activeIndex]);
            return;
        }

        if (event.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div ref={rootRef} className={cn("group relative rounded-xl border border-border p-3", className)}>
            <div className="flex items-center gap-2">
                {icon}
                <input
                    ref={inputRef}
                    value={query}
                    onFocus={() => { if (justSelectedRef.current) { justSelectedRef.current = false; return; } setIsOpen(true); }}
                    onKeyDown={handleKeyDown}
                    onChange={(event) => {
                        const nextValue = event.target.value;
                        setQuery(nextValue); onInputChange?.(nextValue); setActiveIndex(-1); selectedValueRef.current = null;
                        if (nextValue.trim().length < 2) setIsOpen(false);
                    }}
                    placeholder={placeholder}
                    className={cn("w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground", inputClassName)}
                    autoComplete="off"
                />
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-dodger-blue" />}
                
                {onOpenMap && !isLoading && (
                    <button
                        type="button"
                        onClick={onOpenMap}
                        className="absolute opacity-0 right-0 group-hover:opacity-100 group-hover:flex items-center justify-center rounded-md text-muted-foreground dark:text-dodger-blue/80 dark:hover:text-dodger-blue hover:text-foreground transition-all duration-300"
                        title="Choose on map"
                    >
                        <Map className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && (trimmedQuery.length >= 2 || fetchError) && (
                <div className="absolute left-0 right-0 top-[calc(100%+14px)] z-50 max-h-64 overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
                    {fetchError && (
                        <p className="px-3 py-2 text-sm text-red-500">{fetchError}</p>
                    )}

                    {!fetchError && !isLoading && suggestions.length === 0 && (
                        <p className="px-3 py-2 text-sm text-muted-foreground">No locations found</p>
                    )}

                    {!fetchError && suggestions.length > 0 && (
                        <ul className="py-1">
                            {suggestions.map((feature, index) => (
                                <li key={feature.id}>
                                    <button
                                        type="button"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            handleSelect(feature);
                                        }}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={cn(
                                            "w-full px-3 py-2 text-left text-sm text-foreground transition-colors",
                                            "hover:bg-muted focus:bg-muted focus:outline-none",
                                            activeIndex === index && "bg-muted",
                                        )}
                                    >
                                        {feature.place_name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}