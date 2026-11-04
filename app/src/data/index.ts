import eventsJson from './events.json';
import municipalitiesJson from './municipalities.json';
import placesJson from './places.json';
import questsJson from './quests.json';

// Real data, trimmed from backend/data (318 places, 38 municipalities). When the backend API exists (Card 2),
// these lists come from it instead; the shapes below are the same as the API fields.
export type Place = { slug: string; name_sq: string; name_en: string; municipality: string; category: string; lat: number; lng: number; sensitive: boolean; score: number };
export type Municipality = { slug: string; name_sq: string; name_en: string; lat: number; lng: number };
export type KosovoEvent = { slug: string; title_sq: string; title_en: string; municipality: string; starts_at: string; ends_at: string; tentative: boolean };
export type Quest = { slug: string; kind: string; criteria: { category?: string }; target: number; title_sq: string; title_en: string };

export const places = placesJson as Place[];
export const municipalities = municipalitiesJson as Municipality[];
export const events = eventsJson as KosovoEvent[];
export const quests = questsJson as unknown as Quest[];

export const getMunicipality = (slug: string) => municipalities.find((m) => m.slug === slug);
export const getPlace = (slug: string) => places.find((p) => p.slug === slug);

/** The places the user has unlocked. Empty for now: the account and the unlock arrive with Card 2. */
export const stamps: Record<string, { slug: string; at: string }> = {};
