import { RideStatus, RidePreferencesEnum, BookingStatus } from "@/types/Ride";

export const getRideStatusStyle = (rideStatus: RideStatus): string => {
  switch (rideStatus) {
    case RideStatus.Scheduled:
      return "text-foreground  border border-pale-sky/50";
    case RideStatus.InProgress:
      return "bg-dodger-blue text-white";
    case RideStatus.Completed:
      return "bg-approved text-white";
    case RideStatus.Cancelled:
      return "border-rejected-t border text-rejected-t bg-rejected";
    default:
      return "bg-pale-sky/10 text-foreground";
  }
};

//? Service to return the the style of trip's request for the driver
export const getRideRequestsStyle = (requestStatus: BookingStatus): string => {
  switch (requestStatus) {
    case BookingStatus.Pending:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
    case BookingStatus.Accepted:
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
    case BookingStatus.CancelledByRider:
    case BookingStatus.CancelledByDriver:
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/401 dark:text-rose-300 dark:border-rose-300";
    case BookingStatus.Expired:
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-pale-sky/10 text-background";
  }
};
