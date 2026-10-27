import { isLiquidGlassAvailable } from 'expo-glass-effect';
import type { SFSymbol } from 'expo-symbols';
import { Platform, StyleSheet, View } from 'react-native';
import { Button as SwiftButton, Host } from '@expo/ui/swift-ui';
import { buttonBorderShape, buttonStyle, controlSize, foregroundColor, tint } from '@expo/ui/swift-ui/modifiers';

import { palette } from '@/theme/tokens';
import { Icon } from './Icon';
import { Press } from './Press';
import { Txt } from './Txt';

const native = Platform.OS === 'ios' && isLiquidGlassAvailable();

/**
 * The main action over a photo: an ice-blue Liquid Glass capsule with a label.
 * iOS 26 gets Apple's own SwiftUI `glassProminent` button; older iPhones get a flat ice-blue capsule.
 */
export function GlassButton({ label, icon, onPress }: { label: string; icon?: SFSymbol; onPress?: () => void }) {
  if (native) {
    return (
      <View accessible accessibilityRole="button" accessibilityLabel={label}>
        <Host matchContents>
          <SwiftButton
            label={label}
            systemImage={icon}
            onPress={onPress}
            modifiers={[buttonStyle('glassProminent'), buttonBorderShape('capsule'), controlSize('large'), tint(palette.light.ice), foregroundColor(palette.light.iceInk)]}
          />
        </Host>
      </View>
    );
  }
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
