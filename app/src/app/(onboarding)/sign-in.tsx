import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { useT } from '@/lib/i18n';
import { useColors } from '@/theme/tokens';

export default function SignInScreen() {
  const router = useRouter();
  const c = useColors();
  const t = useT();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.grouped }]} edges={['top']}>
      {/* Cancel */}
      <Pressable
        onPress={() => router.replace('/welcome')}
        style={styles.cancelBtn}
        hitSlop={8}
      >
        <Text style={[styles.cancelText, { color: c.blue }]}>{t({ sq: 'Anulo', en: 'Cancel' })}</Text>
      </Pressable>

      {/* Heading */}
      <View style={styles.headingWrap}>
        <Text style={[styles.heading, { color: c.label }]}>{t({ sq: 'Mirë se u ktheve', en: 'Welcome back' })}</Text>
        <Text style={[styles.subtitle, { color: c.label2 }]}>
          {t({ sq: 'Pasaporta dhe shokët të presin.', en: 'Your passport and friends are waiting.' })}
        </Text>
      </View>

      {/* Apple button (visual only) */}
      <Pressable onPress={() => router.replace('/home')} style={[styles.pillBtnBlack, { backgroundColor: c.tint }]}>
        <SymbolView name="apple.logo" size={20} tintColor={c.onTint} style={styles.appleIcon} />
        <Text style={[styles.pillBtnText, { color: c.onTint }]}>{t({ sq: 'Hyr me Apple', en: 'Sign in with Apple' })}</Text>
      </Pressable>

      {/* Separator */}
      <Text style={[styles.or, { color: c.label2 }]}>{t({ sq: 'ose', en: 'or' })}</Text>

      {/* Credentials */}
      <View style={[styles.card, { backgroundColor: c.card }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: c.label }]}>{t({ sq: 'Përdoruesi', en: 'Username' })}</Text>
          <TextInput
            style={[styles.value, { color: c.label }]}
            defaultValue="rinor"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={[styles.divider, { backgroundColor: c.separator }]} />
        <View style={styles.row}>
          <Text style={[styles.label, { color: c.label }]}>{t({ sq: 'Fjalëkalimi', en: 'Password' })}</Text>
          <TextInput
            style={[styles.value, { color: c.label }]}
            defaultValue="fjalekalimi"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Forgot password (visual only) */}
      <Pressable style={styles.forgotWrap}>
        <Text style={[styles.forgotText, { color: c.blue }]}>{t({ sq: 'Harrove fjalëkalimin?', en: 'Forgot your password?' })}</Text>
      </Pressable>

      {/* Login button (visual only) */}
      <Pressable onPress={() => router.replace('/home')} style={[styles.pillBtnBlack, styles.loginBtn, { backgroundColor: c.tint }]}>
        <Text style={[styles.pillBtnText, { color: c.onTint }]}>{t({ sq: 'Hyr', en: 'Sign in' })}</Text>
      </Pressable>

      {/* Footer (visual only) */}
      <Text style={[styles.footer, { color: c.label2 }]}>
        {t({ sq: 'I ri këtu?', en: 'New here?' })}{' '}
        <Text
          style={[styles.footerLink, { color: c.blue }]}
          onPress={() => router.replace('/language')}
        >
          {t({ sq: 'Krijo llogari', en: 'Create account' })}
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
  },
  cancelBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  cancelText: {
    fontSize: 17,
  },
  headingWrap: {
    marginTop: 32,
    paddingHorizontal: 4,
  },
  heading: {
    fontSize: 35,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 2,
  },
  pillBtnBlack: {
    height: 52,
    borderRadius: 28,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  appleIcon: {
    marginRight: 8,
    marginTop: -2,
  },
  pillBtnText: {
    fontSize: 17,
    fontWeight: '700',
  },
  or: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 14,
    height: 101,
    overflow: 'hidden',
  },
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  label: {
    width: 102,
    fontSize: 17,
  },
  value: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    padding: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null),
  },
  divider: {
    height: StyleSheet.hairlineWidth > 0 ? 1 : 1,
    backgroundColor: '#C6C6C8',
    marginHorizontal: 14,
  },
  forgotWrap: {
    alignSelf: 'flex-start',
    marginTop: 14,
    marginLeft: 16,
  },
  forgotText: {
    fontSize: 15,
  },
  loginBtn: {
    backgroundColor: '#0B0B0F',
    marginTop: 30,
  },
  footer: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 24,
  },
  footerLink: {
    fontWeight: '600',
  },
});