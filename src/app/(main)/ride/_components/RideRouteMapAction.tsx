'use client';

import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { useState } from "react";
import RouteModal from "./RouteModal";

type RideRouteMapActionProps = {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    startAddress: string;
    endAddress: string;
    estimatedTime?: string;
    buttonClassName?: string;
    title?: string;
};

export default function RideRouteMapAction({
    startLat,
    startLng,
    endLat,
    endLng,
    startAddress,
    endAddress,
    estimatedTime,
    buttonClassName,
    title = "View route",
}: RideRouteMapActionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                onClick={() => setIsOpen(true)}
                className={buttonClassName}
                title={title}
            >
                <Map className="size-4" />
            </Button>

            <RouteModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                startLat={startLat}
                startLng={startLng}
                endLat={endLat}
                endLng={endLng}
                startAddress={startAddress}
                endAddress={endAddress}
                estimatedTime={estimatedTime}
            />
        </>
    );
}