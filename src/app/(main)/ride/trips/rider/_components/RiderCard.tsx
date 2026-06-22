"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookingStatus,
  RiderTrip,
  RidePreferencesEnum,
  TripPreferences,
} from "@/types/Ride";
import { getDateFormatted } from "@/lib/services/walletService";
import { getRideRequestsStyle } from "@/lib/services/rideService";
import { getFullNameLatters } from "@/lib/services/userProfileService";
import { getRouteEstimatedTime } from "@/lib/actions/Map.Actions";
import RidePreferences from "../../../_components/RidePreferences";
import RideRouteMapAction from "../../../_components/RideRouteMapAction";
import styles from "../../../Ride.module.css";
import { Spinner } from "@/components/ui/spinner";
import { cancelRiderTripAsync } from "@/lib/actions/Ride.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export type RideCardType = "Upcoming" | "History";

export function RiderCard({
  trip,
  rideCardType,
}: {
  trip: RiderTrip;
  rideCardType: RideCardType;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string | undefined>(
    undefined,
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchEstimatedTime = async () => {
      try {
        const time = await getRouteEstimatedTime(
          trip.startLatitude,
          trip.startLongitude,
          trip.endLatitude,
          trip.endLongitude,
        );
        setEstimatedTime(time);
      } catch (error) {
        console.error("Error fetching estimated time:", error);
        setEstimatedTime(undefined);
      }
    };

    fetchEstimatedTime();
  }, [trip]);

  const tripPreferences: TripPreferences = {
    musicAllowed: trip.musicAllowed,
    noSmoking: trip.noSmoking,
    petsWelcomed: trip.petsWelcomed,
    openToConversation: trip.openToConversation,
  };

  const handleCancelingRide = async (rideId: number) => {
    setIsLoading(true);
    const res = await cancelRiderTripAsync(rideId);

    if (res.success) {
      toast.success(res.message, { position: "top-right", duration: 4000 });
      queryClient.invalidateQueries(["riderUpcomingTrips"]);
    } else toast.error(res.message, { position: "top-right", duration: 4000 });

    setIsLoading(false);
  };

  const statusStyle = getRideRequestsStyle(
    BookingStatus[trip.status as keyof typeof BookingStatus] as BookingStatus,
  );

  return (
    <Card className="group h-fit overflow-hidden rounded-2xl border-border bg-card/40 shadow-sm transition-all hover:shadow-md hover:shadow-athens-gray/60 gap-3 pb-0">
      <CardHeader className="flex flex-row items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getFullNameLatters(trip.driverName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight text-foreground">
              {trip.driverName}
            </span>
            <span className="text-pale-sky text-sm">
              Booked {getDateFormatted(trip.bookedAt)}
            </span>
          </div>
        </div>
        <Badge variant="outline" className={statusStyle}>
          {BookingStatus[trip.status as keyof typeof BookingStatus]}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="relative w-full">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1 items-center">
              <div className="bg-background rounded-full size-2.5 border-2 border-foreground shrink-0" />
              <p className="font-normal leading-5 text-sm text-foreground">
                {trip.startAddress}
              </p>
            </div>
            {/*//? Map Button to show the route  */}
            <RideRouteMapAction
              startLat={trip.startLatitude}
              startLng={trip.startLongitude}
              endLat={trip.endLatitude}
              endLng={trip.endLongitude}
              startAddress={trip.startAddress}
              endAddress={trip.endAddress}
              estimatedTime={estimatedTime}
              buttonClassName={`rounded-lg dark:text-dodger-blue hover:bg-athens-gray transition-colors duration-300 cursor-pointer size-8 ${styles.mapBtn}`}
            />
          </div>

          <div className="ms-1 border-s-2 border-dashed border-pale-sky/40 h-6"></div>

          <div className="flex gap-4 items-center mt-1">
            <div className="bg-foreground rounded-full size-2.5 shrink-0" />
            <p className="font-normal leading-5 text-sm text-foreground">
              {trip.endAddress}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2 border-t pt-4 bordr-border">
          <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs text-muted-foreground">
              {getDateFormatted(trip.departureTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs text-muted-foreground">
              {trip.seats} seats
            </span>
          </div>
          {estimatedTime ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs text-muted-foreground">
                {estimatedTime}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-1.5">
            {Object.entries(tripPreferences).map(([key, value]) => (
              <RidePreferences
                key={key}
                icon={key as RidePreferencesEnum}
                ifTrue={value as boolean}
              />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className={`flex items-center justify-between gap-3 border-t bg-muted/20 ${styles.riderCardFooter}`}>
        <div>
          <p className="font-bold text-2xl leading-8 text-foreground">
            EGP {trip.totalAmount}
            <span className="font-normal text-sm leading-5 text-muted-foreground">
              /seat
            </span>
          </p>
        </div>

        {rideCardType === "Upcoming" ? (
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
                  onClick={() => void handleCancelingRide(trip.bookingId)}
                  disabled={isLoading}
                  className="ml-2 rounded-md bg-foreground text-white px-4 py-2 disabled:opacity-50"
                  type="button"
                >
                  {isLoading ? <Spinner /> : "Confirm"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-border bg-muted/40 px-4 hover:opacity-90"
          >
            Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
