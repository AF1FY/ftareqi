"use client";

import { useState } from "react";
import { DriverIcon } from "@/components/svg/DriverIcon";
import { PassengerIcon } from "@/components/svg/PassengerIcon";

// تأكد من استيراد مكونات shadcn/ui الصحيحة في مشروعك
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function ModeToggle({
    isDriver,
    setIsDriver,
    isVerifiedDriver = false,
}: {
    isDriver: boolean;
    setIsDriver: (value: boolean) => void;
    isVerifiedDriver?: boolean;
}) {
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();
    const handleDriverClick = () => {
        if (isVerifiedDriver) {
            setIsDriver(true);
        } else {
            setShowAlert(true);
        }
    };

    const handleGoToRegistration = () => {
        setShowAlert(false);
        router.push("/driver-registration");
    };

    return (
        <div>
            <div className="flex justify-center md:justify-start">
                <div
                    className={`relative inline-flex rounded-full p-1 h-12 w-64 shadow-inner border transition-colors text-white`}
                >
                    <div
                        className={`w-[calc(50%-8px)] absolute left-1 top-1 bottom-1 rounded-full shadow-md transition-transform duration-300 ease-out ${
                            isDriver ? "translate-x-32" : "translate-x-0"
                        } bg-dodger-blue`}
                    ></div>

                    <label
                        className={`w-1/2 h-full flex items-center justify-center z-10 cursor-pointer text-sm font-bold transition-colors ${
                            isDriver ? "text-pale-sky" : ""
                        }`}
                        onClick={() => setIsDriver(false)}
                    >
                        Passenger
                    </label>

                    <label
                        className={`w-1/2 h-full flex items-center justify-center z-10 cursor-pointer text-sm font-bold transition-colors ${
                            isDriver ? "" : "text-pale-sky"
                        }`}
                        onClick={handleDriverClick}
                    >
                        Driver
                    </label>
                </div>
            </div>

            {/* Passenger View */}
            {!isDriver && (
                <div
                    className={`mt-6 rounded-xl border-2 border-dashed p-12 text-center animate-fade-in border-royale-blue/30 bg-dodger-blue/10 relative overflow-hidden`}
                >
                    <div
                        className={`size-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm shadow-dodger-blue/10 bg-background dark:bg-black relative z-10`}
                    >
                        <PassengerIcon className="size-8 text-dodger-blue" />
                    </div>

                    <h3
                        className={`text-xl font-extrabold mb-2 tracking-tight relative z-10`}
                    >
                        Passenger Mode Active
                    </h3>

                    <p
                        className={`text-pale-sky max-w-md mx-auto text-sm leading-relaxed relative z-10`}
                    >
                        You are currently browsing as a passenger. Looking to
                        share your journey, offer rides, and earn money? Apply
                        to become a driver today!
                    </p>
                </div>
            )}

            {/* Driver View */}
            {isDriver && (
                <div className="mt-6 animate-fade-in">
                    <div
                        className={`rounded-xl border-2 border-dashed p-12 text-center border-royale-blue/30 bg-dodger-blue/10`}
                    >
                        <div
                            className={`size-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm shadow-dodger-blue/10 bg-background dark:bg-black`}
                        >
                            <DriverIcon className="size-8 text-dodger-blue" />
                        </div>
                        <h3 className={`text-lg font-bold mb-2`}>
                            Driver View Active
                        </h3>
                        <p className={`text-pale-sky`}>
                            You are now viewing driver-specific features and
                            vehicle information.
                        </p>
                    </div>
                </div>
            )}

            {/* Shadcn Alert Dialog */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Driver Registration Required
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            To access Driver features and offer rides, you need
                            to register and be verified first. Please complete
                            the Driver Registration Form and submit your vehicle
                            documents.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-dodger-blue hover:bg-dodger-blue/90 text-white"
                            onClick={handleGoToRegistration}
                        >
                            Go to Registration
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
