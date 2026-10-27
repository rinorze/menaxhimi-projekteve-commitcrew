import { DynamicColorIOS, Platform } from 'react-native';
import { NativeTabs } from 'expo-router/native-tabs';

import { useT } from '@/lib/i18n';
import { palette } from '@/theme/tokens';

// One ice blue for the selected tab in light and dark mode (palette.ice); the other tabs stay quiet and follow the mode.
const ICE = palette.light.ice;
const IDLE = Platform.OS === 'ios' ? DynamicColorIOS({ light: 'rgba(60,60,67,0.6)', dark: 'rgba(235,235,245,0.6)' }) : 'rgba(60,60,67,0.6)';

/**
 * The tab bar: the native iPhone tab bar with Liquid Glass on iOS 26 (UITabBarController, no custom drawing).
 * Four tabs plus the system search tab. It shrinks while the user scrolls down.
 */
export default function TabsLayout() {
  const t = useT();
  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={ICE} iconColor={{ default: IDLE, selected: ICE }} indicatorColor={ICE}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <NativeTabs.Trigger.Label>{t({ sq: 'Ballina', en: 'Home' })}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="map">
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} />
        <NativeTabs.Trigger.Label>{t({ sq: 'Harta', en: 'Map' })}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="passport">
        <NativeTabs.Trigger.Icon sf={{ default: 'book.closed', selected: 'book.closed.fill' }} />
        <NativeTabs.Trigger.Label>{t({ sq: 'Pasaporta', en: 'Passport' })}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="friends">
        <NativeTabs.Trigger.Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} />
        <NativeTabs.Trigger.Label>{t({ sq: 'Shokët', en: 'Friends' })}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>{t({ sq: 'Kërko', en: 'Search' })}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
