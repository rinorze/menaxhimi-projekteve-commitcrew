// import { ScreenPlaceholder } from '@/components/screen-placeholder';

// // 1.14 · Artiola · For returning users. Only the screen, no real login yet.
// export default function SignIn() {
//   return (
//     <ScreenPlaceholder
//       step="1.14"
//       title="Hyr"
//       owner="Artiola"
//       design="01-onboarding/14-sign-in-returning-users.png"
//       next="/home"
//       nextLabel="Hyr"
//       also={[{ href: '/welcome', label: 'Anulo' }]}
//     />
//   );
// }
import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cancel */}
      <Pressable
        onPress={() => router.replace('/welcome')}
        style={styles.cancelBtn}
        hitSlop={8}
      >
        <Text style={styles.cancelText}>Anulo</Text>
      </Pressable>

      {/* Heading */}
      <View style={styles.headingWrap}>
        <Text style={styles.heading}>Mirë se u ktheve</Text>
        <Text style={styles.subtitle}>Pasaporta dhe shokët të presin.</Text>
      </View>

      {/* Apple button (visual only) */}
      <Pressable style={styles.pillBtnBlack}>
        <Ionicons name="logo-apple" size={22} color="#FFFFFF" style={styles.appleIcon} />
        <Text style={styles.pillBtnText}>Hyr me Apple</Text>
      </Pressable>

      {/* Separator */}
      <Text style={styles.or}>ose</Text>

      {/* Credentials */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Përdoruesi</Text>
          <TextInput
            style={styles.value}
            defaultValue="rinor"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Fjalëkalimi</Text>
          <TextInput
            style={styles.value}
            defaultValue="••••••••••"
            secureTextEntry={false}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Forgot password (visual only) */}
      <Pressable style={styles.forgotWrap}>
        <Text style={styles.forgotText}>Harrove fjalëkalimin?</Text>
      </Pressable>

      {/* Login button (visual only) */}
      <Pressable style={[styles.pillBtnBlack, styles.loginBtn]}>
        <Text style={styles.pillBtnText}>Hyr</Text>
      </Pressable>

      {/* Footer (visual only) */}
      <Text style={styles.footer}>
        I ri këtu? <Text style={styles.footerLink}>Krijo llogari</Text>
      </Text>
    </SafeAreaView>
  );
}

const BLUE = '#007AFF';
const GRAY = '#8E8E93';

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
    color: BLUE,
    fontSize: 17,
  },
  headingWrap: {
    marginTop: 32,
    paddingHorizontal: 4,
  },
  heading: {
    fontSize: 35,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 15,
    color: GRAY,
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
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  or: {
    textAlign: 'center',
    color: GRAY,
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
    color: '#000000',
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
    color: BLUE,
    fontSize: 15,
  },
  loginBtn: {
    backgroundColor: '#0B0B0F',
    marginTop: 30,
  },
  footer: {
    textAlign: 'center',
    color: GRAY,
    fontSize: 15,
    marginTop: 24,
  },
  footerLink: {
    color: BLUE,
    fontWeight: '600',
  },
});