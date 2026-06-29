import { Button } from "@/components/ui/button";
import { getRideStatusStyle } from "@/lib/services/rideService";
import { getDateFormatted, getHourFormatted } from "@/lib/services/walletService";
import { DriverPastRide } from "@/types/Ride";
import { Calendar, Users, Clock, Star } from "lucide-react";
import { RideReviewsListModal } from "./RideReviewsListModal";
import { useState } from "react";

export function PastDriverTripCard({ ride }: { ride: DriverPastRide }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/40 p-4 transition-all hover:shadow-md">
            <div className="flex w-full items-center justify-between">
                <span
                    className={`rounded-full px-3 py-1 text-xs ${getRideStatusStyle(ride.status)}`}
                >
                    {ride.status}
                </span>

                <div className="flex items-center gap-1.5 rounded-lg text-muted-foreground">
                    <Calendar className="size-3.5 text-foreground" strokeWidth={1.5} />
                    <p className="whitespace-nowrap text-xs leading-4">
                        {getDateFormatted(ride.departureTime)}
                    </p>
                </div>
            </div>

            <div className="relative w-full">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-2 mb-0.5">
                        <div className="size-2.5 shrink-0 rounded-full border-2 border-foreground bg-background" />
                        <p className="text-sm leading-5 text-foreground">{ride.startAddress}</p>
                    </div>
                </div>

                <div className="ms-1 h-6 border-s-2 border-dashed border-pale-sky/30" />

                <div className="mt-1 flex items-center gap-2">
                    <div className="size-2.5 shrink-0 rounded-full bg-foreground" />
                    <p className="text-sm leading-5 text-foreground">{ride.endAddress}</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
                <div className="flex w-full flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5">
                        <Users className="size-3.5" />
                        <p className="whitespace-nowrap text-xs leading-4 text-muted-foreground">
                            {ride.takenSeats} seats taken
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5">
                        <Clock className="size-3.5" />
                        <p className="whitespace-nowrap text-xs leading-4 text-muted-foreground">
                            {getHourFormatted(ride.departureTime)}
                        </p>
                    </div>

                    {ride.averageRating ? 
                        <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <p className="whitespace-nowrap text-xs leading-4 text-muted-foreground">
                                {ride.averageRating > 0 ? ride.averageRating.toFixed(1) : "No rating"}
                            </p>
                        </div> : null
                    }
                </div>
            </div>

            <div className="flex w-full items-center justify-between border-t border-border pt-4">
                <div>
                    <p className="text-2xl leading-8 font-bold text-foreground">
                        EGP {ride.totalEarnings}
                        <span className="text-sm leading-5 font-normal text-muted-foreground">
                            {" "}
                            total
                        </span>
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border bg-muted/40 px-4 hover:opacity-90"
                    onClick={() => setIsModalOpen(true)}
                >
                    View Reviews
                </Button>
            </div>
            <RideReviewsListModal rideId={ride.rideId} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}
