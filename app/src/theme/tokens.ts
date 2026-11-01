// Discover Kosovo design tokens, from the final design (Claude Design canvas D13 / docs/design).
// Native iOS 26 look: system font (SF Pro) on the iOS type ramp, Apple's system colours in light and dark,
// Liquid Glass only on controls, black (white in dark) buttons, gold only for rewards (stamps, badges).
import { useColorScheme, type TextStyle } from 'react-native';

export const palette = {
  light: {
    bg: '#FFFFFF',
    grouped: '#F2F2F7',
    surface: '#F2F2F7', // cards and lists on the page
    card: '#FFFFFF',
    fill: 'rgba(120,120,128,0.12)',
    fillStrong: 'rgba(120,120,128,0.2)',
    label: '#000000',
    label2: 'rgba(60,60,67,0.75)',
    label3: 'rgba(60,60,67,0.3)',
    separator: 'rgba(60,60,67,0.29)',
    tint: '#0B0B0F',
    onTint: '#FFFFFF',
    blue: '#007AFF',
    green: '#34C759',
    orange: '#FF9500',
    red: '#FF3B30',
    gold: '#F4B62A',
    goldInk: '#6B4A00',
    stone: '#8E8778',
    ice: '#8CC4FF',
    iceInk: '#FFFFFF', // text and icons on ice-blue buttons: white
  },
  dark: {
    bg: '#000000',
    grouped: '#000000',
    surface: '#1C1C1E', // grouped is pure black in dark, so cards need their own colour
    card: '#1C1C1E',
    fill: 'rgba(120,120,128,0.24)',
    fillStrong: 'rgba(120,120,128,0.36)',
    label: '#FFFFFF',
    label2: 'rgba(235,235,245,0.7)',
    label3: 'rgba(235,235,245,0.3)',
    separator: 'rgba(84,84,88,0.6)',
    tint: '#FFFFFF',
    onTint: '#000000',
    blue: '#0A84FF',
    green: '#30D158',
    orange: '#FF9F0A',
    red: '#FF453A',
    gold: '#F6C343',
    goldInk: '#F6C343',
    stone: '#A39B8B',
    ice: '#8CC4FF',
    iceInk: '#FFFFFF', // text and icons on ice-blue buttons: white
  },
} as const;

export type Palette = { [K in keyof typeof palette.light]: string };

/** Colours for the current light/dark mode. Use this in every screen instead of hard-coded hex values. */
export function useColors(): Palette {
  return useColorScheme() === 'dark' ? palette.dark : palette.light;
}

/** iOS type ramp (size / line height / weight). */
export const text = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} satisfies Record<string, TextStyle>;

export const radius = { row: 12, card: 16, sheet: 22, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

/** Every tappable thing is at least this big (Apple HIG). */
export const minTouch = 44;

/** true in dark mode */
export function useIsDark(): boolean {
  return useColorScheme() === 'dark';
}

/** Motion: calm springs, no bounce except for rewards (the stamp). Duration in milliseconds. */
export const motion = {
  snappy: { duration: 280, dampingRatio: 1 },
  gentle: { duration: 450, dampingRatio: 1 },
  reward: { duration: 700, dampingRatio: 0.72 },
} as const;
