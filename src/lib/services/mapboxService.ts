export type MapboxFeature = {
    id: string;
    place_name: string;
    center: [number, number];
};

export type MapboxResponse = {
    features?: MapboxFeature[];
};

export type MapboxDirectionsResponse = {
    routes?: Array<{
        distance?: number;
        duration?: number;
        geometry?: {
            type?: "LineString";
            coordinates?: [number, number][];
        };
    }>;
};

export function getShortAddress(address: string) {
    const list = address.split(',');
    return list.length >= 3 ? `${list[0]},${list[list.length - 2]}`.trim() : address.trim();
}