'use client';

import { Loader, MapPin, MapPinCheckInside, X } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { renderToString } from "react-dom/server";
import { getRouteGeometry } from "@/lib/actions/Map.Actions";

// 👇 تم إزالة استيراد leaflet و css المباشر من هنا تماماً عشان السيرفر ميضربش
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(mod => mod.Polyline), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface RouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    startAddress: string;
    endAddress: string;
    estimatedTime?: string;
}

export default function RouteModal({
    isOpen,
    onClose,
    startLat,
    startLng,
    endLat,
    endLng,
    startAddress,
    endAddress,
    estimatedTime,
}: RouteModalProps) {
    const [routeGeometry, setRouteGeometry] = useState<Array<[number, number]> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [icons, setIcons] = useState<{ start: any; end: any } | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((L) => {
                import("leaflet/dist/leaflet.css");

                const createCustomIcon = (IconComponent: React.ElementType, colorClass: string) => {
                    const iconHtml = renderToString(
                        <div className="relative flex items-center justify-center">
                            <IconComponent className={`w-9 h-9 drop-shadow-md ${colorClass}`} strokeWidth={2} />
                        </div>
                    );
                    return L.default.divIcon({
                        html: iconHtml,
                        className: "bg-transparent border-none",
                        iconSize: [36, 36],
                        iconAnchor: [18, 36],
                        popupAnchor: [0, -36],
                    });
                };

                setIcons({
                    start: createCustomIcon(MapPin, "text-foreground"),
                    end: createCustomIcon(MapPinCheckInside, "text-dodger-blue"),
                });
            });
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setRouteGeometry(null);
            setError(null);
            return;
        }

        const fetchRoute = async () => {
            setLoading(true);
            setError(null);
            try {
                const geometry = await getRouteGeometry(startLat, startLng, endLat, endLng);

                if (geometry && geometry.coordinates && geometry.coordinates.length > 0) {
                    setRouteGeometry(geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]));
                } else {
                    setError("No route found");
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load route";
                console.error("Error fetching route:", err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [isOpen, startLat, startLng, endLat, endLng]);

    useEffect(() => {
        if (isOpen && routeGeometry && !loading) {
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, routeGeometry, loading]);

    const isDarkMode = typeof document !== 'undefined' ? document.documentElement.classList.contains("dark") : false;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const tileUrl = token 
        ? isDarkMode 
            ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${token}` 
            : `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${token}`
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 md:p-6 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-border p-4 md:p-5">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Route Map</h2>
                        {estimatedTime && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Estimated Time: <span className="font-medium text-foreground">{estimatedTime}</span>
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="relative flex-1 w-full h-full overflow-hidden bg-background">
                    {loading ? (
                        <div className="flex h-full w-full items-center justify-center">
                            <Loader className="size-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="rounded-lg bg-destructive/10 p-4">
                                <p className="font-medium text-destructive">{error}</p>
                            </div>
                        </div>
                    ) : routeGeometry && routeGeometry.length > 0 && icons ? (
                        <MapContainer
                            bounds={routeGeometry}
                            boundsOptions={{ padding: [50, 50] }}
                            className="h-full w-full z-10"
                            style={{ background: 'transparent' }}
                        >
                            <TileLayer url={tileUrl} attribution='&copy; Mapbox' />
                            <Polyline
                                positions={routeGeometry}
                                pathOptions={{ color: "#2563EB", weight: 5, opacity: 0.8 }}
                            />
                            <Marker position={[startLat, startLng]} icon={icons.start}>
                                <Popup>
                                    <div className="max-w-[200px] text-sm">
                                        <p className="mb-1 font-semibold">Pick up</p>
                                        <p className="text-muted-foreground">{startAddress}</p>
                                    </div>
                                </Popup>
                            </Marker>
                            <Marker position={[endLat, endLng]} icon={icons.end}>
                                <Popup>
                                    <div className="max-w-[200px] text-sm">
                                        <p className="mb-1 font-semibold">Drop off</p>
                                        <p className="text-muted-foreground">{endAddress}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted/30">
                            <p className="text-muted-foreground">Unable to load route map</p>
                        </div>
                    )}
                </div>

                <div className="shrink-0 space-y-3 border-t border-border bg-muted/20 p-4 md:p-5 text-sm">
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 size-5 shrink-0 text-foreground" />
                        <span className="leading-relaxed text-foreground">{startAddress}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPinCheckInside className="mt-0.5 size-5 shrink-0 text-dodger-blue" />
                        <span className="leading-relaxed text-foreground">{endAddress}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}