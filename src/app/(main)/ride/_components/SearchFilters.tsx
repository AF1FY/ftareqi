"use client";

import { useEffect, useState } from "react";
import { addDays, format, startOfDay } from "date-fns";
import {
    Calendar,
    Minus,
    Plus,
    Star,
    TrendingDown,
    Users,
    X,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { IGender } from "@/types/User";
import { RideField } from "@/types/Ride";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import styles from "../Ride.module.css";
import { RideCriteriaFormValues } from "../../../../lib/validators/ride.schema";

interface SearchFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    selectedRideField?: RideField;
    onSelectRideField: (field?: RideField) => void;
    onReset: () => void;
}

type SeatDirection = "up" | "down" | null;

const toDateOnlyKey = (date: Date) => format(date, "yyyy-MM-dd");

export function SearchFilters({
    isOpen,
    onClose,
    isMobile,
    isCollapsed = false,
    onToggleCollapse,
    selectedRideField,
    onSelectRideField,
    onReset,
}: SearchFiltersProps) {
    const MAX_SEATS = 5;
    const { watch, setValue } = useFormContext<RideCriteriaFormValues>();
    const committedDepartureTime = watch("departureTime");
    const committedSeats = watch("seats") ?? 1;
    const committedGender = watch("gender");

    const [draftRideField, setDraftRideField] = useState<RideField | undefined>(selectedRideField);
    const [draftDepartureTime, setDraftDepartureTime] = useState<Date>(
        committedDepartureTime ?? startOfDay(new Date()),
    );
    const [draftSeats, setDraftSeats] = useState<number>(committedSeats);
    const [draftGender, setDraftGender] = useState<IGender | undefined>(committedGender);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [seatDirection, setSeatDirection] = useState<SeatDirection>(null);
    const [previousSeat, setPreviousSeat] = useState<number | null>(null);

    useEffect(() => {
        setDraftRideField(selectedRideField);
    }, [selectedRideField]);

    useEffect(() => {
        if (committedDepartureTime) {
            setDraftDepartureTime(committedDepartureTime);
        }
    }, [committedDepartureTime]);

    useEffect(() => {
        if (typeof committedSeats === "number") {
            setDraftSeats(committedSeats);
        }
    }, [committedSeats]);

    useEffect(() => {
        setDraftGender(committedGender);
    }, [committedGender]);

    const handleSeatChange = (nextSeat: number, direction: Exclude<SeatDirection, null>) => {
        setPreviousSeat(draftSeats);
        setSeatDirection(direction);
        setDraftSeats(nextSeat);

        window.setTimeout(() => {
            setPreviousSeat(null);
            setSeatDirection(null);
        }, 300);
    };

    const handleIncrement = () => {
        if (draftSeats < 8) {
            handleSeatChange(draftSeats + 1, "up");
        }
    };

    const handleDecrement = () => {
        if (draftSeats > 1) {
            handleSeatChange(draftSeats - 1, "down");
        }
    };

    const handleReset = () => {
        setDraftRideField(undefined);
        setDraftDepartureTime(startOfDay(new Date()));
        setDraftSeats(1);
        setDraftGender(undefined);
        setSeatDirection(null);
        setPreviousSeat(null);
        onReset();
    };

    const handleApply = () => {
        setValue("departureTime", draftDepartureTime, { shouldDirty: true, shouldTouch: true });
        setValue("seats", draftSeats, { shouldDirty: true, shouldTouch: true });
        setValue("gender", draftGender, { shouldDirty: true, shouldTouch: true });
        onSelectRideField(draftRideField);
    };

    const content = (
        <div className={`p-6 ${isMobile ? "rounded-t-3xl" : "sticy top-[201px]"}`}>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg text-foreground">Filters</h2>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleReset} className="text-sm text-dodger-blue hover:text-dodger-blue/80">
                        Reset
                    </button>
                    {isMobile && (
                        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <section>
                    <h3 className="mb-3 text-sm text-foreground">Sort By</h3>
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => setDraftRideField(RideField.Cheapest)}
                            className={cn(
                                `w-full rounded-xl border-l-4 p-4 text-left transition-all`,
                                draftRideField === RideField.Cheapest
                                    ? "border-foreground dark:border-dodger-blue dark:bg-dodger-blue/10 bg-athens-gray text-foreground"
                                    : "border-transparent hover:bg-athens-gray/40 hover:text-foreground text-pale-sky dark:hover:bg-background"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <TrendingDown className="h-5 w-5" />
                                <span>Cheapest</span>
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setDraftRideField(RideField.HighestRate)}
                            className={cn(
                                "w-full rounded-xl border-l-4 p-4 text-left transition-all",
                                draftRideField === RideField.HighestRate
                                    ? "border-foreground dark:border-dodger-blue dark:bg-dodger-blue/10 bg-athens-gray text-foreground"
                                    : "border-transparent hover:bg-athens-gray/40 hover:text-foreground text-pale-sky dark:hover:bg-background"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <Star className="h-5 w-5" />
                                <span>Top Rated</span>
                            </span>
                        </button>
                    </div>
                </section>

                <div className="h-px bg-border" />

                <section>
                    <h3 className="mb-3 flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-4 w-4" />
                        Departure Date
                    </h3>

                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-11 w-full justify-start border border-athens-gray px-4 text-left font-normal"
                            >
                                {format(draftDepartureTime, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto border-athens-gray bg-background p-0" align="start">
                            <ShadcnCalendar
                                mode="single"
                                selected={draftDepartureTime}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                onSelect={(selectedDate) => {
                                    if (!selectedDate) {
                                        return;
                                    }

                                    const nextDate = new Date(selectedDate);
                                    nextDate.setHours(
                                        draftDepartureTime.getHours(),
                                        draftDepartureTime.getMinutes(),
                                        0,
                                        0,
                                    );
                                    setIsCalendarOpen(false);
                                    setDraftDepartureTime(nextDate);
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setDraftDepartureTime(startOfDay(new Date()))}
                            className={cn(
                                "rounded-xl p-3 transition-all",
                                toDateOnlyKey(draftDepartureTime) === toDateOnlyKey(new Date())
                                    ? "dark:border-dodger-blue bg-foreground dark:bg-dodger-blue text-white"
                                    : "border-border text-pale-sky hover:text-foreground bg-pale-sky/10 hover:bg-pale-sky/20",
                            )}
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => setDraftDepartureTime(startOfDay(addDays(new Date(), 1)))}
                            className={cn(
                                "rounded-xl p-3 transition-all",
                                toDateOnlyKey(draftDepartureTime) === toDateOnlyKey(addDays(new Date(), 1))
                                    ? "dark:border-dodger-blue bg-foreground dark:bg-dodger-blue text-white"
                                    : "border-border text-pale-sky hover:text-foreground bg-pale-sky/10 hover:bg-pale-sky/20",
                            )}
                        >
                            Tomorrow
                        </button>
                    </div>
                </section>

                <div className="h-px bg-border" />

                <section>
                    <h3 className="mb-3 flex items-center gap-2 text-sm text-foreground">
                        <Users className="h-4 w-4" />
                        Seats Needed
                    </h3>

                    <div className="flex items-center justify-center gap-6 rounded-xl py-4">
                        <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={draftSeats <= 1}
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all",
                                draftSeats <= 1
                                    ? "cursor-not-allowed bg-muted/40 text-muted-foreground opacity-40"
                                    : "text-foreground hover:bg-muted",
                            )}
                        >
                            <Minus className="h-5 w-5" />
                        </button>

                        <div className="relative h-8 w-12 overflow-hidden">
                            {previousSeat !== null && (
                                <div
                                    key={`previous-${previousSeat}`}
                                    className={cn(
                                        "absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground",
                                        seatDirection === "up" && styles["animate-slide-out-down"],
                                        seatDirection === "down" && styles["animate-slide-out-up"],
                                    )}
                                >
                                    {previousSeat}
                                </div>
                            )}
                            <div
                                key={`current-${draftSeats}`}
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground",
                                    seatDirection === "up" && styles["animate-slide-down"],
                                    seatDirection === "down" && styles["animate-slide-up"],
                                )}
                            >
                                {draftSeats}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleIncrement}
                            disabled={draftSeats >= MAX_SEATS}
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all",
                                draftSeats >= MAX_SEATS
                                    ? "cursor-not-allowed bg-muted/40 text-muted-foreground opacity-40"
                                    : "text-foreground hover:bg-muted",
                            )}
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </section>

                <div className="h-px bg-border" />

                <section>
                    <h3 className="mb-3 text-sm text-foreground">Driver Gender</h3>
                    <div className="flex gap-2">
                        {([undefined, IGender.Male, IGender.Female] as const).map((option) => {
                            const isSelected = draftGender === option || (!draftGender && option === undefined);
                            const label = option ?? "Any";

                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setDraftGender(option)}
                                    className={cn(
                                        "flex-1 rounded-full py-2.5 text-sm transition-colors",
                                        isSelected
                                            ? "bg-black dark:bg-dodger-blue text-white"
                                            : "bg-pale-sky/10 text-pale-sky hover:text-foreground hover:bg-pale-sky/20",
                                    )}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>

            {!isMobile && (
                <button
                    type="submit"
                    onClick={handleApply}
                    className="mt-6 w-full rounded-full bg-foreground dark:bg-dodger-blue text-white py-3 transition-opacity hover:opacity-90"
                >
                    Apply Filters
                </button>
            )}
        </div>
    );

    if (isMobile && !isOpen) {
        return null;
    }

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose}>
                <div
                    className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl dark:bg-black bg-background"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="mx-auto mb-2 mt-4 h-1.5 w-12 rounded-full bg-card-foreground" />
                    {content}
                    <div className="px-6 pb-6">
                        <button
                            type="submit"
                            onClick={() => {
                                handleApply();
                                onClose();
                            }}
                            className="w-full rounded-full py-3 bg-foreground dark:bg-dodger-blue text-white transition-opacity hover:opacity-90"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative hidden transition-all duration-300 lg:block", isCollapsed ? "w-0" : "w-[260px]")}>
            {!isCollapsed && (
                <div className="relative">
                    {content}
                </div>
            )}
        </div>
    );
}
