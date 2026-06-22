import { MapboxDirectionsResponse, MapboxResponse } from "../services/mapboxService";

const assertMapboxToken = () => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
        throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN is missing");
    }
    return token;
};

const hasLatinCharacters = (value: string) => /[A-Za-z]/.test(value);

const normalizeMapboxAddress = (address: string) => {
    const parts = address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    const englishParts = parts.filter(hasLatinCharacters);

    if (englishParts.length > 0) {
        return englishParts.join(", ");
    }

    return address.trim();
};

export async function searchMapboxAddresses(query: string, signal?: AbortSignal) {
    const token = assertMapboxToken();
    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&country=eg&autocomplete=true&limit=5&types=region,place,locality,neighborhood,address,poi&proximity=ip&language=en`,
        { signal }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch Mapbox suggestions");
    }

    const data = (await response.json()) as MapboxResponse;
    return (data.features ?? []).map((feature) => ({
        ...feature,
        place_name: normalizeMapboxAddress(feature.place_name),
    }));
}

export async function reverseGeocodeMapbox(
    latitude: number,
    longitude: number,
    signal?: AbortSignal
) {

    const token = assertMapboxToken();
    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&language=en`,
        { signal }
    );

    if (!response.ok) {
        throw new Error("Failed to reverse geocode current location");
    }

    const data = (await response.json()) as MapboxResponse;
    return normalizeMapboxAddress(data.features?.[0]?.place_name ?? "");
}

export async function getRouteDistanceKilometers(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    signal?: AbortSignal
) {
    const token = assertMapboxToken();
    const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startLongitude},${startLatitude};${endLongitude},${endLatitude}?access_token=${token}&geometries=geojson&overview=full&language=en`,
        { signal }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch route distance");
    }

    const data = (await response.json()) as MapboxDirectionsResponse;
    const distanceInMeters = data.routes?.[0]?.distance;

    if (typeof distanceInMeters !== "number" || !Number.isFinite(distanceInMeters)) {
        return null;
    }

    return distanceInMeters / 1000;
}

export async function getRouteGeometry(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    signal?: AbortSignal
) {
    const token = assertMapboxToken();
    const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startLongitude},${startLatitude};${endLongitude},${endLatitude}?access_token=${token}&geometries=geojson&overview=full&language=en`,
        { signal }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch route geometry");
    }

    const data = (await response.json()) as MapboxDirectionsResponse;
    return data.routes?.[0]?.geometry ?? null;
}

const readNumberEnv = (value: string | undefined, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const calculateTripCost = (distanceInKm: number): { maxPrice: number; suggestedPrice: number } => {
    const gasPrice = readNumberEnv(process.env.NEXT_PUBLIC_GAS_PRICE, 22.25);
    const consumptionPerKm = readNumberEnv(process.env.NEXT_PUBLIC_CONSUMPTION_PER_KM, 0.1);
    const wearAndTear = readNumberEnv(process.env.NEXT_PUBLIC_WEAR_AND_TEAR, 1.5);
    const totalTripCost = distanceInKm * consumptionPerKm * gasPrice * wearAndTear;
    const maxPrice = Math.ceil(totalTripCost / 2);
    const suggestedPrice = Math.ceil(maxPrice * 0.75);
    return {
        maxPrice,
        suggestedPrice
    }
}

export async function getRouteEstimatedTime(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    signal?: AbortSignal
) {
    const token = assertMapboxToken();
    const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startLongitude},${startLatitude};${endLongitude},${endLatitude}?access_token=${token}&geometries=geojson&overview=full&language=en`,
        { signal }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch route estimated time");
    }

    const data = (await response.json()) as MapboxDirectionsResponse;
    const durationInSeconds = data.routes?.[0]?.duration;

    if (typeof durationInSeconds !== "number" || !Number.isFinite(durationInSeconds)) {
        return undefined;
    }

    const minutes = Math.round(durationInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
}