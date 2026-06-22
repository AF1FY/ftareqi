"use client";
import { getRideStatusStyle } from "@/lib/services/rideService";
import {
  getDateFormatted,
  getHourFormatted,
} from "@/lib/services/walletService";
import {
  DriverUpcomingRides,
  RidePreferencesEnum,
  TripPreferences,
} from "@/types/Ride";
import { Calendar, Users, Clock } from "lucide-react";
import RidePreferences from "../../_components/RidePreferences";
import RideRouteMapAction from "../../_components/RideRouteMapAction";
import styles from "../../Ride.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cancelRideAsync } from "@/lib/actions/Ride.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function DriverRideCard({
  ride,
}: {
  ride: DriverUpcomingRides;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const tripPreferences: TripPreferences = {
    musicAllowed: ride.musicAllowed,
    noSmoking: ride.noSmoking,
    petsWelcomed: ride.petsWelcomed,
    openToConversation: ride.openToConversation,
  };

  const handleCancelingRide = async (rideId: number) => {
    setIsLoading(true);
    const res = await cancelRideAsync(rideId);

    if (res.success) {
      toast.success(res.message, { position: "top-right", duration: 4000 });
      queryClient.invalidateQueries(["driver-upcoming-drives"]);
    } else toast.error(res.message, { position: "top-right", duration: 4000 });

    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 bg-card/40 rounded-2xl border border-border overflow-hidden transition-all group hover:shadow-md hover:shadow-athens-gray/60">
        <div className="flex items-center justify-between w-full">
          <span
            className={`px-3 py-1 rounded-full text-xs ${getRideStatusStyle(ride.status)}`}
          >
            {ride.status}
          </span>

          <div className="flex gap-1.5 items-center rounded-lg text-muted-foreground">
            <Calendar className="size-3.5 text-foreground" strokeWidth={1.5} />
            <p className="font-normal leading-4 text-xs whitespace-nowrap">
              {getDateFormatted(ride.departureTime)}
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1 items-center">
              <div className="bg-background rounded-full size-2.5 border-2 border-foreground shrink-0" />
              <p className="font-normal leading-5 text-sm text-foreground">
                {ride.startAddress}
              </p>
            </div>
            {/*//? Map Button to show the route  */}
            <RideRouteMapAction
              startLat={ride.startLatitude}
              startLng={ride.startLongitude}
              endLat={ride.endLatitude}
              endLng={ride.endLongitude}
              startAddress={ride.startAddress}
              endAddress={ride.endAddress}
              buttonClassName={`rounded-lg dark:text-dodger-blue hover:bg-athens-gray transition-colors duration-300 cursor-pointer size-8 ${styles.mapBtn}`}
            />
          </div>

          <div className="ms-1 border-s-2 border-dashed border-pale-sky/40 h-6"></div>

          <div className="flex gap-4 items-center mt-1">
            <div className="bg-foreground rounded-full size-2.5 shrink-0" />
            <p className="font-normal leading-5 text-sm text-foreground">
              {ride.endAddress}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap gap-2 w-full">
            <div className="flex gap-1.5 items-center px-3 py-1.5 rounded-lg border border-border">
              <Users className="size-3.5" />
              <p className="font-normal leading-4 text-pale-sky text-xs whitespace-nowrap">
                {ride.availableSeats} seats left
              </p>
            </div>

            <div className="flex gap-1.5 items-center px-3 py-1.5 rounded-lg border border-border">
              <Clock className="size-3.5" />
              <p className="font-normal leading-4 text-pale-sky text-xs whitespace-nowrap">
                {getHourFormatted(ride.departureTime)}
              </p>
            </div>

            <div className="flex gap-1.5 items-center px-3 py-1.5 rounded-lg border border-border">
              <p className="font-normal leading-4 text-pale-sky text-xs whitespace-nowrap">
                Wait: {ride.waitingTimeMinutes} min
              </p>
            </div>
          </div>

          <div className="flex items-center justify-evenly gap-3 px-3 py-1.5 rounded-lg border border-border w-fit">
            {Object.entries(tripPreferences).map(([key, value]) => (
              <RidePreferences
                key={key}
                icon={key as RidePreferencesEnum}
                ifTrue={value as boolean}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between w-full pt-4 border-t border-border">
          <div>
            <p className="font-bold text-2xl leading-8 text-foreground">
              EGP {ride.pricePerSeat}
              <span className="font-normal text-sm leading-5 text-muted-foreground">
                /seat
              </span>
            </p>
          </div>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setConfirmOpen(true)}
                className="bg-pale-sky/10 border-border border font-semibold hover:opacity-90 px-2 py-1 hover:text-rejected-t rounded-full transition-all"
              >
                Cancel
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm booking</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this ride ?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="rounded-md border border-border px-4 py-2 bg-background"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleCancelingRide(ride.rideId)}
                  disabled={isLoading}
                  className="ml-2 rounded-md bg-foreground text-white px-4 py-2 disabled:opacity-50"
                  type="button"
                >
                  {isLoading ? <Spinner /> : "Confirm"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
