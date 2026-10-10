import { UserCoordinates } from '../types';

// Default reference city center coordinates (Metropolis downtown)
export const DEFAULT_CITY_COORDINATES: UserCoordinates = {
  latitude: 45.5152,
  longitude: -122.6784
};

/**
 * Calculates great-circle distance between two points in miles using Haversine formula
 */
export function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(miles: number | null | undefined): string {
  if (miles === null || miles === undefined || isNaN(miles)) return '';
  if (miles < 0.1) return 'Within walking distance (<0.1 mi)';
  if (miles === 1) return '1.0 mile away';
  return `${miles.toFixed(1)} miles away`;
}
