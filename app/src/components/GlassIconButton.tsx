import { isLiquidGlassAvailable } from 'expo-glass-effect';
import type { SFSymbol } from 'expo-symbols';
import { Platform, View } from 'react-native';
import { Button as SwiftButton, Host } from '@expo/ui/swift-ui';
import { buttonBorderShape, buttonStyle, controlSize, labelStyle } from '@expo/ui/swift-ui/modifiers';

import { Glass } from './Glass';
import { Icon } from './Icon';
import { Press } from './Press';

const native = Platform.OS === 'ios' && isLiquidGlassAvailable();

/**
 * A round Liquid Glass button with an SF Symbol (bell, back, camera…).
 * On iOS 26 it is Apple's own SwiftUI glass button (real refraction, press and morph animation);
 * on older iPhones it falls back to the translucent JS version.
 */
export function GlassIconButton({ name, label, onPress, size = 44 }: { name: SFSymbol; label: string; onPress?: () => void; size?: number }) {
  if (native) {
    return (
      <View accessible accessibilityRole="button" accessibilityLabel={label} style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Host matchContents>
          <SwiftButton
            label={label}
            systemImage={name}
            onPress={onPress}
            modifiers={[buttonStyle('glass'), labelStyle('iconOnly'), buttonBorderShape('circle'), controlSize(size >= 56 ? 'extraLarge' : 'large')]}
          />
        </Host>
      </View>
    );
  }
  return (
    <Press onPress={onPress} accessibilityLabel={label} scaleTo={0.92}>
      <Glass interactive style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Icon name={name} size={20} />
      </Glass>
    </Press>
  );
}
