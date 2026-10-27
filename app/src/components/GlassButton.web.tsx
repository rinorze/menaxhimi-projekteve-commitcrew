import type { SFSymbol } from 'expo-symbols';
import { StyleSheet } from 'react-native';

import { palette } from '@/theme/tokens';
import { Icon } from './Icon';
import { Press } from './Press';
import { Txt } from './Txt';

/** Web preview (for laptops without an iPhone): the flat ice-blue capsule. iPhones use GlassButton.tsx (SwiftUI). */
export function GlassButton({ label, icon, onPress }: { label: string; icon?: SFSymbol; onPress?: () => void }) {
  return (
    <Press onPress={onPress} accessibilityLabel={label} style={styles.fallback}>
      {icon ? <Icon name={icon} size={17} tone="iceInk" weight="semibold" /> : null}
      <Txt variant="headline" tone="iceInk">
        {label}
      </Txt>
    </Press>
  );
}

const styles = StyleSheet.create({
  fallback: { height: 50, paddingHorizontal: 24, borderRadius: 25, backgroundColor: palette.light.ice, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
