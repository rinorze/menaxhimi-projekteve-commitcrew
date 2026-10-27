import * as Location from 'expo-location';
import { useSyncExternalStore } from 'react';

import { municipalities, type Place } from '@/data';

// Where you are, for distances and "near you". It stays on the phone: nothing here is sent anywhere, and friends
// never see it (sharing with friends is a separate, off-by-default setting for later).

export type Coords = { lat: number; lng: number };
export type LocationState = { status: 'unknown' | 'asking' | 'granted' | 'denied'; coords?: Coords };

let state: LocationState = { status: 'unknown' };
const listeners = new Set<() => void>();
const set = (next: LocationState) => {
  state = next;
  listeners.forEach((l) => l());
};

async function readPosition() {
  try {
    const last = await Location.getLastKnownPositionAsync();
    if (last) set({ status: 'granted', coords: { lat: last.coords.latitude, lng: last.coords.longitude } });
    const here = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    set({ status: 'granted', coords: { lat: here.coords.latitude, lng: here.coords.longitude } });
  } catch {
    // permission is granted but there is no fix yet (indoors, airplane mode): keep what we have
    if (state.status !== 'granted') set({ status: 'granted' });
  }
}

/** Asks for permission once (iOS shows its own dialog) and then reads the position. */
export async function requestLocation() {
  set({ ...state, status: 'asking' });
  const res = await Location.requestForegroundPermissionsAsync();
  if (res.status !== 'granted') {
    set({ status: 'denied' });
    return;
  }
  await readPosition();
}

let checked = false;
/** If the user already allowed it earlier, pick the position up silently; never shows a dialog by itself. */
export async function restoreLocation() {
  if (checked) return;
  checked = true;
  const res = await Location.getForegroundPermissionsAsync();
  if (res.status === 'granted') await readPosition();
  else if (res.status === 'denied' && !res.canAskAgain) set({ status: 'denied' });
}

export function useLocation(): LocationState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

/** Straight-line distance in km (haversine). Good enough for "2.4 km away" in a country this size. */
export function distanceKm(a: Coords, b: Coords) {
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export const distanceTo = (from: Coords | undefined, p: Pick<Place, 'lat' | 'lng'>) => (from ? distanceKm(from, p) : undefined);

/** "850 m", "2.4 km", "38 km" */
export function formatKm(km: number) {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

/** The municipality whose centre is closest to you. */
export function nearestMunicipality(from: Coords) {
  let best = municipalities[0];
  let bestKm = Infinity;
  for (const m of municipalities) {
    const km = distanceKm(from, { lat: m.lat, lng: m.lng });
    if (km < bestKm) {
      best = m;
      bestKm = km;
    }
  }
  return best;
}
