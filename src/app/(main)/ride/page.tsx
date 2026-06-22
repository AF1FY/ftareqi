"use client";

import { useEffect, useState, useMemo } from "react";
import { ArrowUp, Loader2, SlidersHorizontal } from "lucide-react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchRidesAsync } from "@/lib/actions/Ride.actions";
import { RideField, RideSearchResposneDto, RideCriteria } from "@/types/Ride";
import { RideCard } from "./_components/ride-card";
import { RideCardSkeleton } from "./_components/RideCardSkeleton";
import { SearchHeader } from "./_components/search-header";
import {
    RideCriteriaFormValues,
    rideCriteriaSchema,
} from "../../../lib/validators/ride.schema";
import { getDateFormatted } from "@/lib/services/walletService";
import { SearchFilters } from "./_components/SearchFilters";

const buildActiveFilters = (
    criteria: RideCriteriaFormValues,
    rideField?: RideField,
): string[] => {
    const filters: string[] = [];

    if (criteria.seats !== undefined) {
        filters.push(`Seats: ${criteria.seats}`);
    }

    if (criteria.gender) {
        filters.push(criteria.gender);
    }

    if (criteria.departureTime) {
        const s = getDateFormatted(criteria.departureTime.toISOString());
        if (s)
            filters.push(s);
    }

    if (rideField) {
        filters.push(rideField);
    }

    return filters;
};

export default function App() {
    const router = useRouter();
    const pathname = usePathname();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [hasSearched, setHasSearched] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [selectedRideField, setSelectedRideField] = useState<RideField | undefined>(undefined);
    const [startPlace, setStartPlace] = useState("");
    const [endPlace, setEndPlace] = useState("");

    const form = useForm<RideCriteriaFormValues>({
        resolver: zodResolver(rideCriteriaSchema) as Resolver<RideCriteriaFormValues>,
        defaultValues: {},
    });

    const searchParams = useSearchParams();

    // Parse URL search params into RideCriteria
    const parsedCriteria = useMemo(() => {
        const entries = Array.from(searchParams?.entries() ?? []);
        const params = Object.fromEntries(entries as [string, string][]);

        const toNum = (k: string | undefined) => {
            if (k == null) return undefined;
            const n = Number(k);
            return Number.isFinite(n) ? n : undefined;
        };

        return {
            startLatitude: toNum(params.startLatitude),
            startLongitude: toNum(params.startLongitude),
            endLatitude: toNum(params.endLatitude),
            endLongitude: toNum(params.endLongitude),
            seats: toNum(params.seats),
            departureTime: params.departureTime ? new Date(params.departureTime) : undefined,
            gender: params.gender as any,
        } as RideCriteria;
    }, [searchParams]);

    const infiniteQuery = useInfiniteQuery(
        ["searchRides", parsedCriteria, selectedRideField],
        async ({ pageParam = 1 }) => {
            const response = await searchRidesAsync({
                Page: pageParam,
                PageSize: 12,
                criteria: parsedCriteria,
                filters: selectedRideField,
            });

            if (!response.success)
                console.error(response.errors);

            console.log('Search Response :', response);

            return response.data ?? {
                items: [],
                page: pageParam,
                pageSize: 12,
                totalCount: 0,
                totalPages: 0,
            };
        },
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
                return undefined;
            },
            keepPreviousData: true,
        }
    );

    const isLoading = infiniteQuery.isLoading;
    const pages = infiniteQuery.data?.pages ?? [];
    const items = pages.flatMap((p) => p.items ?? []);

    useEffect(() => {
        setHasSearched(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (values: RideCriteriaFormValues) => {
        const params = new URLSearchParams();

        const setParamIfExists = (key: string, value: string | number | undefined) => {
            if (value === undefined) {
                return;
            }

            const normalized = String(value).trim();
            if (!normalized) {
                return;
            }

            params.set(key, normalized);
        };

        setParamIfExists("startLatitude", values.startLatitude);
        setParamIfExists("startLongitude", values.startLongitude);
        setParamIfExists("endLatitude", values.endLatitude);
        setParamIfExists("endLongitude", values.endLongitude);
        setParamIfExists("seats", values.seats);
        setParamIfExists("gender", values.gender);
        setParamIfExists("departureTime", values.departureTime?.toISOString());
        setParamIfExists("startPlace", startPlace);
        setParamIfExists("endPlace", endPlace);
        setParamIfExists("filters", selectedRideField);

        const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.push(nextUrl);

        setActiveFilters(buildActiveFilters(values, selectedRideField));
        setHasSearched(true);
    };

    const handleResetFilters = () => {
        form.reset({});
        setSelectedRideField(undefined);
        setStartPlace("");
        setEndPlace("");
        setActiveFilters([]);
        setHasSearched(true);
    };

    // Load-more handled via react-query infiniteQuery

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <FormProvider {...form}>
            <div className="full-scn">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void form.handleSubmit(handleSearch)(event);
                    }}
                >
                    <SearchHeader
                        onOpenFilters={() => setIsFilterOpen(true)}
                        fromInitialValue={startPlace}
                        toInitialValue={endPlace}
                        onFromPlaceChange={setStartPlace}
                        onToPlaceChange={setEndPlace}
                        onSearchSubmit={() => void form.handleSubmit(handleSearch)()}
                    />

                    <button
                        onClick={scrollToTop}
                        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#1E90FF] text-white shadow-lg transition-all hover:bg-[#1873CC] ${showScrollTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
                            }`}
                        aria-label="Scroll to top"
                        type="button"
                    >
                        <ArrowUp className="h-6 w-6" />
                    </button>

                    <div className="mx-auto max-w-7xl px-4 py-8 2xl:px-0">
                        <div className="flex gap-6">
                            <SearchFilters
                                isOpen={isFilterOpen}
                                onClose={() => setIsFilterOpen(false)}
                                isMobile
                                selectedRideField={selectedRideField}
                                onSelectRideField={setSelectedRideField}
                                onReset={handleResetFilters}
                            />

                            <SearchFilters
                                isOpen
                                onClose={() => undefined}
                                isMobile={false}
                                isCollapsed={isFilterCollapsed}
                                onToggleCollapse={() => setIsFilterCollapsed((previousState) => !previousState)}
                                selectedRideField={selectedRideField}
                                onSelectRideField={setSelectedRideField}
                                onReset={handleResetFilters}
                            />

                            <div className="flex-1">
                                {hasSearched && (
                                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                                        <div className="hidden lg:block">
                                            <button
                                                type="button"
                                                onClick={() => setIsFilterCollapsed((previousState) => !previousState)}
                                                className="flex size-10 bg-background items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
                                                title="Expand filters"
                                            >
                                                <SlidersHorizontal className="size-5" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setIsFilterOpen(true)}
                                            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-foreground transition-colors hover:bg-muted lg:hidden"
                                            type="button"
                                        >
                                            <SlidersHorizontal className="h-4 w-4 dark:text-dodger-blue" />
                                            <span>Filters</span>
                                        </button>

                                        {activeFilters.length > 0 && (
                                            <div className="flex flex-wrap gap-2 px-2">
                                                {activeFilters.map((filter) => (
                                                    <span
                                                        key={filter}
                                                        className="rounded-full bg-foreground dark:bg-dodger-blue text-white px-3 py-1.5 text-sm"
                                                    >
                                                        {filter}
                                                    </span>
                                                ))}
                                            </div>
                                        )}


                                    </div>
                                )}

                                {hasSearched && items.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {items.map((ride: RideSearchResposneDto) => (
                                                <RideCard
                                                    key={ride.rideId}
                                                    ride={ride}
                                                    requestedSeats={parsedCriteria.seats ?? 1}
                                                />
                                            ))}
                                            {isLoading && (
                                                <>
                                                    {[...Array(6)].map((_, i) => (
                                                        <RideCardSkeleton key={`skeleton-${i}`} />
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                        <div className="mt-8 flex justify-center">
                                            {infiniteQuery.hasNextPage ? (
                                                <button
                                                    onClick={() => void infiniteQuery.fetchNextPage()}
                                                    disabled={infiniteQuery.isFetchingNextPage}
                                                    className="flex items-center gap-2 rounded-full border border-border px-8 py-3 text-foreground transition-colors hover:bg-card disabled:opacity-50"
                                                    type="button"
                                                >
                                                    {infiniteQuery.isFetchingNextPage ? (
                                                        <>
                                                            <Loader2 className="h-5 w-5 animate-spin text-[#1E90FF]" />
                                                            <span>Loading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Load More Rides</span>
                                                            <span>↓</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : null}
                                        </div>
                                    </>
                                ) : hasSearched && items.length === 0 && !isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-[50vh]">
                                        <i className="fa-solid fa-bucket mb-4 text-2xl"></i>
                                        <h3 className="mb-2 text-2xl text-foreground">No Rides Found</h3>
                                        <p className="max-w-md text-center text-muted-foreground">
                                            Try adjusting your filters or search a different route
                                        </p>
                                        <button
                                            onClick={handleResetFilters}
                                            className="text-dodger-blue hover:text-dodger-blue/70 mt-2"
                                            type="button"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                ) : hasSearched && isLoading ? (
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {[...Array(6)].map((_, i) => (
                                            <RideCardSkeleton key={`initial-skeleton-${i}`} />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </FormProvider>
    );
}
