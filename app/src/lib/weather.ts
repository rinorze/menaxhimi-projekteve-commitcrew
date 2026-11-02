import { useEffect, useState } from 'react';

import type { SFSymbol } from 'expo-symbols';

export type Weather = { tempC: number; symbol: SFSymbol; sq: string; en: string };

// WMO weather codes from Open-Meteo (https://open-meteo.com, free, no key). Credit: "Weather data by Open-Meteo.com".
function describe(code: number, day: boolean): Pick<Weather, 'symbol' | 'sq' | 'en'> {
  if (code === 0) return { symbol: day ? 'sun.max.fill' : 'moon.stars.fill', sq: 'Qiell i hapur', en: 'Clear' };
  if (code <= 2) return { symbol: day ? 'cloud.sun.fill' : 'cloud.moon.fill', sq: 'Pak re', en: 'Partly cloudy' };
  if (code === 3) return { symbol: 'cloud.fill', sq: 'Vrenjtur', en: 'Cloudy' };
  if (code <= 48) return { symbol: 'cloud.fog.fill', sq: 'Mjegull', en: 'Fog' };
  if (code <= 67 || (code >= 80 && code <= 82)) return { symbol: 'cloud.rain.fill', sq: 'Shi', en: 'Rain' };
  if (code <= 77 || code === 85 || code === 86) return { symbol: 'cloud.snow.fill', sq: 'Dëborë', en: 'Snow' };
  return { symbol: 'cloud.bolt.fill', sq: 'Stuhi', en: 'Thunderstorm' };
}

/** The real current weather at a point. Returns undefined while loading or when offline (the UI then simply hides it). */
export function useWeather(lat: number, lng: number): Weather | undefined {
  const [weather, setWeather] = useState<Weather>();
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => {
        const c = j?.current;
        if (c && typeof c.temperature_2m === 'number') setWeather({ tempC: c.temperature_2m, ...describe(c.weather_code ?? 0, c.is_day === 1) });
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [lat, lng]);
  return weather;
}

export const WEATHER_CREDIT = 'Weather data by Open-Meteo.com';
