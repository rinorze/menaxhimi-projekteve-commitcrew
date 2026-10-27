import { useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Every onboarding screen in the order of the design. Open it with a long press on the logo on Welcome.
const SCREENS: { step: string; title: string; href: Href; owner: string }[] = [
  { step: '1.1', title: 'Mirë se vjen', href: '/welcome', owner: 'Artiola' },
  { step: '1.2', title: 'Shiko përreth', href: '/look-around', owner: 'Artiola' },
  { step: '1.3', title: 'Kalaja e Novobërdës', href: '/guest-place', owner: 'Artiola' },
  { step: '1.4', title: 'Gjuha', href: '/language', owner: 'Artiola' },
  { step: '1.5', title: 'Ku je sot?', href: '/where-today', owner: 'Erleta' },
  { step: '1.6', title: 'Kthimi', href: '/kthimi', owner: 'Erleta' },
  { step: '1.7', title: 'Çfarë të pëlqen?', href: '/interests', owner: 'Erleta' },
  { step: '1.8', title: 'Pamja jote', href: '/avatar', owner: 'Elvina' },
  { step: '1.9', title: 'Sende që i fiton', href: '/avatar-rewards', owner: 'Elvina' },
  { step: '1.10', title: 'Ruaje pasaportën', href: '/save-passport', owner: 'Erleta' },
  { step: '1.11', title: 'Privat që në fillim', href: '/privacy', owner: 'Erleta' },
  { step: '1.12', title: 'Mjafton një shok', href: '/one-friend', owner: 'Elvina' },
  { step: '1.13', title: 'Kilometri i parë', href: '/first-km', owner: 'Elvina' },
  { step: '1.14', title: 'Hyr', href: '/sign-in', owner: 'Artiola' },
];

export default function AllScreens() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32, paddingHorizontal: 16 }}
    >
      <Text style={styles.title}>Të gjitha ekranet</Text>
      <Text style={styles.sub}>1.1 deri 1.14, sipas dizajnit. Prek një ekran për ta hapur.</Text>
      <View style={styles.card}>
        {SCREENS.map((s, i) => (
          <Pressable
            key={s.step}
            onPress={() => router.push(s.href)}
            style={({ pressed }) => [styles.row, i > 0 && styles.rowBorder, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.step}>{s.step}</Text>
            <Text style={styles.name}>{s.title}</Text>
            <Text style={styles.owner}>{s.owner}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F7' },
  title: { fontSize: 34, lineHeight: 41, fontWeight: '800', color: '#000' },
  sub: { fontSize: 15, color: 'rgba(60,60,67,0.6)', marginTop: 4, marginBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: 16, gap: 14 },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(60,60,67,0.29)' },
  step: { width: 40, fontSize: 15, fontWeight: '700', color: '#007AFF' },
  name: { flex: 1, fontSize: 17, color: '#000' },
  owner: { fontSize: 13, color: 'rgba(60,60,67,0.6)' },
});
