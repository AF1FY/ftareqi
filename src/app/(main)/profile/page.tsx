"use client";

import { useState } from "react";
import ProfileCard from "./_components/profile-card";
import ModeToggle from "./_components/mode-toggle";
import PerformanceCard from "./_components/performance-card";
import VehicleCard from "./_components/vehicle-card";
import DocumentsCard from "./_components/documents-card";
import { useTheme } from "next-themes";
import { useProfileData, useDriverProfileData } from "./_hooks/useProfileData";

export default function ProfilePage() {
    const [isDriver, setIsDriver] = useState(false);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const {
        data: profile,
        isLoading: isProfileLoading,
        isError: isProfileError,
        error: profileError,
    } = useProfileData();
    const {
        data: driverData,
        isLoading: isDriverDataLoading,
        isError: isDriverDataError,
    } = useDriverProfileData();

    const shouldShowDriverSection = isDriver && !!driverData?.driverDetails;

    return (
        <div className="w-full">
            <div className="overflow-y-auto p-4 md:p-8 lg:px-12 pb-20 scroll-smooth">
                <div className="max-w-5xl mx-auto space-y-8">
                    <ProfileCard
                        isDark={isDark}
                        profile={profile}
                        isLoading={isProfileLoading}
                        isError={isProfileError}
                        error={profileError as Error | null}
                    />
                    <ModeToggle
                        isDriver={isDriver}
                        setIsDriver={setIsDriver}
                        isVerifiedDriver={
                            !!profile?.isDriver || !!driverData?.driverDetails
                        }
                    />

                    {shouldShowDriverSection && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                            <div className="md:col-span-4">
                                <PerformanceCard
                                    isDark={isDark}
                                    driver={driverData?.driverDetails}
                                    isLoading={isDriverDataLoading}
                                />
                            </div>
                            <div className="md:col-span-8 space-y-6">
                                <VehicleCard
                                    isDark={isDark}
                                    car={driverData?.carDetails}
                                    isLoading={isDriverDataLoading}
                                />
                                <DocumentsCard
                                    isDark={isDark}
                                    driver={driverData?.driverDetails}
                                    isLoading={isDriverDataLoading}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
