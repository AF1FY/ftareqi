import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Banknote,
  Clock,
  MapPin,
  Users,
  Circle,
  CheckCircle2,
  XCircle,
  TimerOff,
  Loader2,
} from "lucide-react";
import { BookingStatus, DriverRequests } from "@/types/Ride";
import { getRideRequestsStyle } from "@/lib/services/rideService";
import { getFullNameLatters } from "@/lib/services/userProfileService";
import {
  getFullDateFormatted,
} from "@/lib/services/walletService";
import styles from '../../Ride.module.css'

interface RideRequestCardProps {
  request: DriverRequests;
  onAccept?: (id: number) => void;
  onDecline?: (id: number) => void;
  isDeclining?: boolean;
  isAccepting?: boolean;
}

export function RideRequestCard({
  request,
  onAccept,
  onDecline,
  isDeclining,
  isAccepting,
}: RideRequestCardProps) {
  const status = getRideRequestsStyle(request.status);

  return (
    <Card className="shadow-sm border-border h-full flex flex-col gap-2 py-0">
      <CardHeader className="flex flex-row items-center justify-between py-5 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getFullNameLatters(request.riderName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg leading-tight">
              {request.riderName}
            </span>
            <span className="text-sm text-muted-foreground">
              Requested {getFullDateFormatted(request.requestedAt)}
            </span>
          </div>
        </div>
        <Badge variant="outline" className={status}>
          {request.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6 flex-1">
        <div className="relative">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <Circle className="h-3 w-3 text-primary fill-primary" />
              <div className="w-px h-6 bg-border my-1" />
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-6.5 flex-1 min-w-0">
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate">
                  {request.startAddress}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate">
                  {request.endAddress}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">Departure</span>
            </div>
            <span className="font-semibold text-sm">
              {getFullDateFormatted(request.departureTime)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">Seats</span>
            </div>
            <span className="font-semibold text-sm">
              {request.requestedSeats}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Banknote className="h-3.5 w-3.5" />
              <span className="text-xs">Total</span>
            </div>
            <span className="font-semibold text-sm">{request.totalAmount}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className={`flex gap-4 pt-4 border-t bg-muted/20 mt-auto items-center justify-center ${styles.driverCardFooter}`}>
        {request.status === BookingStatus.Pending ? (
          <>
            <Button
              variant="outline"
              className="w-1/2 hover:bg-destructive/10"
              onClick={() => onDecline?.(request.bookingId)}
              disabled={isDeclining}
            >
              {isDeclining ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                "Decline"
              )}
            </Button>
            <Button
              className="w-1/2 bg-primary text-primary-foreground"
              onClick={() => onAccept?.(request.bookingId)}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                "Accept"
              )}
            </Button>
          </>
        ) : request.status === BookingStatus.Accepted ? (
          <div className="flex items-center justify-center gap-2 w-full text-sm font-medium text-emerald-700 dark:text-emerald-300 py-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>You accepted this request</span>
          </div>
        ) : request.status === BookingStatus.Expired ? (
          <div className="flex items-center justify-center gap-2 w-full text-sm font-medium text-muted-foreground py-2">
            <TimerOff className="h-4 w-4" />
            <span>This request has expired</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full text-sm font-medium text-rose-700 dark:text-rose-300 py-2">
            <XCircle className="h-4 w-4" />
            <span>
              {request.status === BookingStatus.CancelledByRider
                ? "Cancelled by the rider"
                : "You cancelled this request"}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
