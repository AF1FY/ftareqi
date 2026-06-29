import React, { useState } from "react";
import { Star, Route, Car, Flag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getTripDriverDetailsAsync } from "@/lib/actions/Profile.actions";
import DriverProfileModalSkeleton from "./DriverProfileModalSkeleton";
import { getDateFormatted } from "@/lib/services/walletService";
import { getFullNameLatters } from "@/lib/services/userProfileService";
import Image from "next/image";
import { ReportUserDialog } from "./report-user-dialog";

//? Custom Hook
export function useDriverProfile(driverId: string, isModalOpen: boolean) {
    return useQuery({
        queryKey: ["tripDriverProfile", driverId],
        queryFn: () => getTripDriverDetailsAsync(driverId),
        enabled: isModalOpen,
        staleTime: 1000 * 60 * 5,
    });
}

export function DriverProfileModal({
    driverId,
    driverName,
    driverProfileImage,
}: {
    driverId: string;
    driverName: string;
    driverProfileImage?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const {
        data: response,
        isLoading,
        isError,
    } = useDriverProfile(driverId, isOpen);

    const driver = response?.data;

    const handleReportClick = () => {
        setIsOpen(false);
        setIsReporting(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild className="cursor-pointer">
                {driverProfileImage ? (
                    <Image
                        src={driverProfileImage}
                        alt={driverName}
                        className="w-12 h-12 rounded-full object-cover"
                        width={48}
                        height={48}
                    />
                ) : (
                    <Avatar className="h-11 w-11 cursor-pointer">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {getFullNameLatters(driverName)}
                        </AvatarFallback>
                    </Avatar>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-6 gap-0 outline-none">
                <DialogHeader className="mb-0">
                    <DialogTitle className="sr-only">
                        Driver Profile
                    </DialogTitle>
                </DialogHeader>

                {/*//? Loading state  */}
                {isLoading && <DriverProfileModalSkeleton />}

                {isError && (
                    <div className="py-12 text-center text-destructive flex flex-col items-center gap-2">
                        <p>Something went wrong, Please try again later</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                )}

                {driver && !isLoading && !isError && (
                    <>
                        {/* Header */}
                        <div className="flex flex-col items-center mt-2">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-sm -mt-12 mb-3">
                                <AvatarImage
                                    src={driver.driverImg}
                                    alt={`${driver.name} Image`}
                                />
                                <AvatarFallback>
                                    {driver.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <h2 className="text-2xl font-bold text-foreground">
                                {driver.name}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {driver.gender} &bull; Joined{" "}
                                {getDateFormatted(driver.joinedAt)}
                            </p>

                            <div className="flex w-full items-center justify-center gap-6 mt-6">
                                <div className="flex flex-col items-center justify-between gap-1 flex-1">
                                    <div className="flex items-center gap-2 h-6 text-foreground font-semibold text-lg">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 ml-1.5" />
                                        {/*//? If new driver has no stars */}
                                        {driver.rating !== null ? (
                                            <>
                                                {driver.rating.toFixed(1)}
                                                <span className="text-muted-foreground text-sm font-normal mr-1">
                                                    / 5.0
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm">
                                                {" "}
                                                New{" "}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">
                                        Rating
                                    </span>
                                </div>

                                <Separator
                                    orientation="vertical"
                                    className="h-10"
                                />

                                <div className="flex flex-col items-center justify-between gap-1 flex-1">
                                    <div className="flex items-center h-6 gap-2 text-foreground font-semibold text-lg">
                                        <Route className="w-5 h-5 text-muted-foreground ml-1.5" />
                                        {driver.tripsTaken}
                                        <span className="text-muted-foreground text-sm font-normal mr-1">
                                            Trips
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">
                                        Experience
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/*//? Footer */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-semibold ps-1 text-muted-foreground uppercase tracking-wider">
                                Vehicle Details
                            </h3>
                            <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-xl border border-border/50">
                                {driver.carImg ? (
                                    <img
                                        src={driver.carImg}
                                        alt={driver.carModel}
                                        className="h-16 w-24 object-cover rounded-lg shadow-sm"
                                        onError={(e) => {
                                            // If image loading failed
                                            (
                                                e.target as HTMLElement
                                            ).style.display = "none";
                                            (
                                                e.target as HTMLElement
                                            ).nextElementSibling?.classList.remove(
                                                "hidden",
                                            );
                                            (
                                                e.target as HTMLElement
                                            ).nextElementSibling?.classList.add(
                                                "flex",
                                            );
                                        }}
                                    />
                                ) : null}

                                {/* Alternative Image icon */}
                                <div
                                    className={`h-16 w-24 bg-muted items-center justify-center rounded-lg shadow-sm ${driver.carImg ? "hidden" : "flex"}`}
                                >
                                    <Car className="w-6 h-6 text-muted-foreground" />
                                </div>

                                <div className="flex flex-col gap-1.5 flex-1 justify-center">
                                    <span className="font-medium ps-0.5 text-foreground text-base leading-tight">
                                        {driver.carModel}
                                    </span>
                                    <div className="inline-flex justify-start">
                                        <span
                                            className="inline-flex items-center bg-muted/50 text-muted-foreground font-mono text-xs font-semibold tracking-widest px-2.5 py-1 rounded-md border shadow-sm"
                                            dir="ltr"
                                        >
                                            {driver.carPlate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="mt-6 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={handleReportClick}
                    >
                        <Flag className="w-4 h-4" />
                        Report Driver
                    </Button>
                </div>
            </DialogContent>
            <ReportUserDialog
                key={driverId}
                open={isReporting}
                onOpenChange={setIsReporting}
                reportedUserId={driverId}
                reportedUserImage={driver?.driverImg}
                reportedUserName={driverName}
                reportedUserRating={driver?.rating}
            />
        </Dialog>
    );
}
