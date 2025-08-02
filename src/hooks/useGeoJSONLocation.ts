import { GeoJSONPoint } from "../utils/types";
import { useCallback, useEffect, useState } from "react";

async function getGeoLocation(): Promise<GeoJSONPoint> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('Geolocation is not supported by this browser.'));
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;
                resolve({ type: 'Point', coordinates: [longitude, latitude] });
            },
            (err) => {
                reject(new Error(err.message) || 'Failed to get geolocation');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
}

export function useGeoJSONLocation() {
    const [location, setLocation] = useState<GeoJSONPoint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const requestLocation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try{
            const geo = await getGeoLocation();
            setLocation(geo);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [])
    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    return { location, error, isLoading };
}