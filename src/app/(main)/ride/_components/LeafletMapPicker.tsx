"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, MapContainer, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { MapPin, MapPinCheckInside, LocateFixed, Loader2 } from "lucide-react";
import { renderToString } from "react-dom/server";
import { getRouteGeometry, reverseGeocodeMapbox } from "@/lib/actions/Map.Actions";
import { cn } from "@/lib/utils";

type LeafletCoords = { lat: number; lng: number };

const normalizeMapboxAddress = (address: string) => {
    const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
    const englishParts = parts.filter((part) => /[A-Za-z]/.test(part));
    return englishParts.length > 0 ? englishParts.join(", ") : address.trim();
};

type LeafletMapPickerProps = {
    coords: LeafletCoords;
    address: string;
    startCoords: LeafletCoords | null;
    endCoords: LeafletCoords | null;
    onCoordsChange: (coords: LeafletCoords) => void;
    onAddressChange: (address: string) => void;
    showCurrentLocationButton?: boolean;
    activeField?: "start" | "end" | null;
};

const createCustomIcon = (IconComponent: React.ElementType, colorClass: string) => {
    const iconHtml = renderToString(
        <div className="relative flex items-center justify-center">
            <IconComponent className={`w-9 h-9 drop-shadow-md ${colorClass}`} strokeWidth={2} />
        </div>
    );
    return L.divIcon({
        html: iconHtml, className: "bg-transparent border-none",
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
    });
};

const startMarkerIcon = createCustomIcon(MapPin, "text-foreground");
const endMarkerIcon = createCustomIcon(MapPinCheckInside, "text-dodger-blue");
const draggableMarkerIcon = createCustomIcon(MapPin, "text-dodger-blue");

function MapViewUpdater({ coords }: { coords: LeafletCoords }) {
    const map = useMap();
    useEffect(() => {
        map.setView([coords.lat, coords.lng], map.getZoom(), { animate: true });
    }, [coords.lat, coords.lng, map]);
    return null;
}

function MapClickHandler({ onCoordsChange }: { onCoordsChange: (coords: LeafletCoords) => void }) {
    useMapEvents({
        click(event) {
            onCoordsChange({ lat: event.latlng.lat, lng: event.latlng.lng });
        },
    });
    return null;
}

function FitBoundsOnRoute({ routePoints }: { routePoints: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (routePoints.length < 2) return;
        const bounds = L.latLngBounds(routePoints);
        map.fitBounds(bounds, { padding: [32, 32], animate: true });
    }, [map, routePoints]);
    return null;
}

export default function LeafletMapPicker({
    coords, address, startCoords, endCoords, onCoordsChange, onAddressChange,
    showCurrentLocationButton = false,
    activeField = null
}: LeafletMapPickerProps) {
    const center = useMemo(() => [coords.lat, coords.lng] as [number, number], [coords.lat, coords.lng]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [routeData, setRouteData] = useState<[number, number][]>([]);
    const [isLocating, setIsLocating] = useState(false);
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    useEffect(() => {
        const root = document.documentElement;
        const updateTheme = () => setIsDarkMode(root.classList.contains("dark"));
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const loadAddress = async () => {
            try {
                const resolvedAddress = await reverseGeocodeMapbox(coords.lat, coords.lng, controller.signal);
                if (!controller.signal.aborted && resolvedAddress) {
                    onAddressChange(normalizeMapboxAddress(resolvedAddress));
                }
            } catch (error) {}
        };
        const timeoutId = window.setTimeout(() => void loadAddress(), 250);
        return () => { controller.abort(); window.clearTimeout(timeoutId); };
    }, [coords.lat, coords.lng, onAddressChange]);

    useEffect(() => {
        const controller = new AbortController();
        if (!startCoords || !endCoords) {
            setRouteData([]);
            return () => controller.abort();
        }
        const loadRoute = async () => {
            try {
                const geometry = await getRouteGeometry(startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng, controller.signal);
                if (controller.signal.aborted || !geometry?.coordinates?.length) return;
                const path = geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
                setRouteData(path);
            } catch (error) { setRouteData([]); }
        };
        void loadRoute();
        return () => controller.abort();
    }, [startCoords, endCoords]);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                onCoordsChange({ lat: position.coords.latitude, lng: position.coords.longitude });
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location", error);
                setIsLocating(false);
                alert("Could not get your location. Please check permissions.");
            },
            { enableHighAccuracy: true }
        );
    };

    const tileUrl = mapboxToken
        ? isDarkMode
            ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`
            : `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    return (
        <div className="flex h-full flex-col gap-4 relative bg-background">
            <div className="flex items-center gap-2 rounded-xl border border-athens-gray bg-white-athens-gray px-4 py-3 text-sm">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="line-clamp-1">{address || "Move the marker or click the map to pick a location."}</span>
            </div>

            <div className="h-[60vh] relative overflow-hidden rounded-2xl border border-athens-gray bg-background">
                
                {showCurrentLocationButton && (
                    <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        disabled={isLocating}
                        className="absolute top-4 right-4 z-400 flex size-10 dark:text-dodger-blue items-center justify-center rounded-full bg-background shadow-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
                        title="Get Current Location"
                    >
                        {isLocating ? <Loader2 className="h-5 w-5 animate-spin text-dodger-blue" /> : <LocateFixed className="h-5 w-5" />}
                    </button>
                )}

                <MapContainer 
                    center={center} 
                    zoom={13} 
                    className="h-full w-full z-10"
                    style={{ background: 'transparent' }}
                >
                    <TileLayer attribution="&copy; Mapbox" url={tileUrl} keepBuffer={4} updateWhenZooming={false} />
                    <MapViewUpdater coords={coords} />
                    <MapClickHandler onCoordsChange={onCoordsChange} />
                    
                    {routeData.length > 1 && (
                        <>
                            <Polyline positions={routeData} pathOptions={{ color: "#2563EB", weight: 5, opacity: 0.75 }} />
                            <FitBoundsOnRoute routePoints={routeData} />
                        </>
                    )}
                    
                    {startCoords && activeField !== "start" && <Marker position={[startCoords.lat, startCoords.lng]} icon={startMarkerIcon} />}
                    {endCoords && activeField !== "end" && <Marker position={[endCoords.lat, endCoords.lng]} icon={endMarkerIcon} />}
                    
                    <Marker
                        position={center} draggable icon={draggableMarkerIcon}
                        eventHandlers={{
                            dragend(event) {
                                const latLng = event.target.getLatLng();
                                onCoordsChange({ lat: latLng.lat, lng: latLng.lng });
                            },
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}