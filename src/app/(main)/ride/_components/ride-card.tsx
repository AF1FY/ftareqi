import { Button } from "@/components/ui/button";
import { getRideStatusStyle } from "@/lib/services/rideService";
import {
  getBalanceAsync,
  getDateFormatted,
} from "@/lib/services/walletService";
import { getRouteEstimatedTime } from "@/lib/actions/Map.Actions";
import { RidePreferencesEnum, RideSearchResposneDto } from "@/types/Ride";
import { Clock, Users, Star, BadgeX, BadgeCheckIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/hooks/useCustomToast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styles from "../Ride.module.css";
import { TripPreferences } from "./../../../../types/Ride";
import RidePreferences from "./RidePreferences";
import RideRouteMapAction from "./RideRouteMapAction";
import { bookRideAsync } from "@/lib/actions/Ride.actions";
import { DriverProfileModal } from "../../profile/_components/DriverProfileModal";

export function RideCard({
  ride,
  requestedSeats = 1,
}: {
  ride: RideSearchResposneDto;
  requestedSeats?: number;
}) {
  const [estimatedTime, setEstimatedTime] = useState<string | undefined>(
    undefined,
  );
  const [loadingTime, setLoadingTime] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const [isRideAffordable, setIsRideAffordable] = useState(false);
  const queryClient = useQueryClient();
  const { showNotification } = useCustomToast();

  useEffect(() => {
    const fetchEstimatedTime = async () => {
      try {
        setLoadingTime(true);
        const time = await getRouteEstimatedTime(
          ride.startLatitude,
          ride.startLongitude,
          ride.endLatitude,
          ride.endLongitude,
        );
        setEstimatedTime(time);
      } catch (error) {
        console.error("Error fetching estimated time:", error);
        setEstimatedTime(undefined);
      } finally {
        setLoadingTime(false);
      }
    };

    fetchEstimatedTime();
  }, [ride]);

  const tripPreferences: TripPreferences = {
    musicAllowed: ride.musicAllowed,
    noSmoking: ride.noSmoking,
    petsWelcomed: ride.petsWelcomed,
    openToConversation: ride.openToConversation,
  };

  const onShowingModal = async () => {
    const userBalance = await getBalanceAsync();
    if (userBalance >= ride.pricePerSeat * requestedSeats)
      setIsRideAffordable(true);
    else setIsRideAffordable(false);
    setConfirmOpen(true);
  };

  const handleConfirmBooking = async (rideId: number, numberOfSeats = 1) => {
    setBooking(true);
    const res = await bookRideAsync(rideId, numberOfSeats);

    if (res.success) {
      showNotification({
        title: "Booking successful",
        body: res.message,
        icon: <BadgeCheckIcon size={24} />,
      });
      setConfirmOpen(false);
      void queryClient.invalidateQueries(["searchRides"]);
    } else {
      showNotification({
        title: "Booking failed",
        body: res.message,
        icon: <BadgeX size={24} />,
      });
    }

    setBooking(false);
  };

  return (
    <>
      <div className="group bg-card/40 rounded-2xl border border-border overflow-hidden transition-all group hover:shadow-md hover:shadow-athens-gray/60">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DriverProfileModal driverId={ride.driverUserId} driverName={ride.driverName} driverProfileImage={ride.driverImgUrl} />
              <div>
                <p className="text-foreground font-semibold">
                  {ride.driverName}
                </p>
                {ride.driverRate && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-dodger-blue text-dodger-blue" />
                    <span>{ride.driverRate}</span>
                  </div>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs ${getRideStatusStyle(ride.status)}`}
            >
              {ride.status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between mb-0">
              <div className="flex gap-2 flex-1">
                <div className="w-2 h-2 rounded-full bg-foreground mt-1.5 shrink-0"></div>
                <p className="text-foreground text-sm line-clamp-1">
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
                estimatedTime={estimatedTime}
                buttonClassName={`rounded-lg dark:text-dodger-blue hover:bg-athens-gray transition-colors duration-300 cursor-pointer size-8 ${styles.mapBtn}`}
              />
            </div>
            <div className="ms-1 border-s-2 border-dashed border-pale-sky/40 h-4"></div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-foreground mt-1.5 shrink-0"></div>
              <p className="text-foreground text-sm line-clamp-1">
                {ride.endAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 ps-1 py-4 border-t border-border">
            <p className="text-sm">Preferences:</p>
            {Object.entries(tripPreferences).map(([key, value]) => (
              <RidePreferences
                key={key}
                icon={key as RidePreferencesEnum}
                ifTrue={value as boolean}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs text-muted-foreground">
                {getDateFormatted(ride.departureTime)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs text-muted-foreground">
                {ride.availableSeats} seats left
              </span>
            </div>
            {estimatedTime && (
              <div className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs text-muted-foreground">
                  {estimatedTime}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-foreground text-2xl font-bold">
                EGP {ride.pricePerSeat}
              </span>
              <span className="text-muted-foreground text-sm ml-1">/seat</span>
            </div>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={onShowingModal}
                  className="bg-foreground dark:bg-dodger-blue font-bold hover:opacity-90 text-white px-4 py-2.5 rounded-full transition-all"
                >
                  Book Now
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm booking</DialogTitle>
                  <DialogDescription>
                    {isRideAffordable
                      ? "You can cancel the ride anytime. Do you want to confirm booking this ride?"
                      : "You don't have enough money on wallet, you can topup and try again later."}
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  {isRideAffordable ? (
                    <>
                      <button
                        onClick={() => setConfirmOpen(false)}
                        className="rounded-md border border-border px-4 py-2 bg-background"
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          void handleConfirmBooking(ride.rideId, requestedSeats)
                        }
                        disabled={booking}
                        className="ml-2 rounded-md bg-foreground text-background px-4 py-2 disabled:opacity-50"
                        type="button"
                      >
                        {booking ? "Booking..." : "Confirm"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmOpen(false)}
                      className="rounded-lg bg-foreground text-background px-3 py-2 disabled:opacity-50"
                      type="button"
                    >
                      Ok
                    </button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
