// import { ScreenPlaceholder } from '@/components/screen-placeholder';

// // 1.2 · Artiola · Guest map, no account needed. The pin you tap opens that place.
// export default function LookAround() {
//   return (
//     <ScreenPlaceholder
//       step="1.2"
//       title="Shiko përreth"
//       owner="Artiola"
//       design="01-onboarding/02-look-around-guest-map.png"
//       next="/guest-place"
//       nextLabel="Hap Kalanë e Novobërdës"
//     />
//   );
// }
import { useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, Animated, Image,
  StyleSheet, useColorScheme, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const PLACES = [
  { id: 'kalaja', name: 'Kalaja e Novobërdës', image: require('../../../assets/images/kalaja-e-novo-berdes.jpg') },
  { id: 'ujevarat', name: 'Ujëvarat e Mirushës', image: require('../../../assets/images/ujevarat-e-mirushes.jpg') },
  { id: 'gjeravica', name: 'Gjeravica', image: require('../../../assets/images/gjeravica.jpg') },
];

const PINS = [
  { id: 'ujevarat', x: 0.336, y: 0.306, icon: 'water', big: false },
  { id: 'gjeravica', x: 0.69, y: 0.274, icon: 'image-filter-hdr', big: false },
  { id: 'kalaja', x: 0.526, y: 0.383, icon: 'shield', big: true },
] as const;

export default function LookAround() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const dark = useColorScheme() === 'dark';
  const c = dark
    ? { bg: '#2a2b28', ink: '#f4f4f1', muted: '#a3a39d', card: '#262725', chip: 'rgba(38,39,37,.92)' }
    : { bg: '#e9e8e4', ink: '#0c0c0c', muted: '#6f6f6b', card: '#ffffff', chip: 'rgba(255,255,255,.92)' };

  // Asnjë e zgjedhur në fillim
  const [active, setActive] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);

  // Fleta poshtë
  const sheetY = useRef(new Animated.Value(0)).current;
  const toggleSheet = () => {
    Animated.spring(sheetY, {
      toValue: minimized ? 0 : 1,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
    setMinimized(!minimized);
  };

  const openPlace = (id: string) => {
    setActive(id);
    router.push({ pathname: '/guest-place', params: { id } });
  };

  return (
    <View style={[s.app, { backgroundColor: c.bg }]}>
      {/* Sfondi i hartës (fiks) */}
      <Image
        source={require('../../../assets/images/guest-map.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* quiet the terrain like the design: a soft wash, stronger at the edges so pins and panel read well */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: dark ? 'rgba(30,31,29,0.55)' : 'rgba(236,234,227,0.5)' }]} pointerEvents="none" />

      {/* Pikat pozicionohen sipas përmasave të ekranit. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {PINS.map((p) => {
          const size = p.big ? 46 : 40;
          const on = active === p.id;
          return (
            <Pressable
              key={p.id}
              accessibilityLabel={PLACES.find((x) => x.id === p.id)?.name}
              onPress={() => openPlace(p.id)}
              style={[
                s.pin,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  left: width * p.x - size / 2,
                  top: height * p.y - size / 2,
                  backgroundColor: on ? '#111' : '#fff',
                  transform: [{ scale: on ? 1.12 : 1 }],
                },
              ]}
            >
              <MaterialCommunityIcons name={p.icon} size={20} color={on ? '#fff' : '#111'} />
            </Pressable>
          );
        })}
      </View>

      {/* Sipër: kërkimi + "Si mysafir" (vetëm pamje) */}
      <SafeAreaView edges={['top']} style={s.top} pointerEvents="box-none">
        <View style={[s.search, { backgroundColor: c.chip }]}>
          <Ionicons name="search" size={17} color={c.muted} />
          <TextInput
            style={[s.input, { color: c.ink }]}
            placeholder="Provo “Pejë” ose “ujëvara”"
            placeholderTextColor={c.muted}
            accessibilityLabel="Kërko"
          />
        </View>
        <View style={[s.guest, { backgroundColor: c.chip }]}>
          <Ionicons name="alert-circle-outline" size={14} color={c.ink} />
          <Text style={[s.guestText, { color: c.ink }]}>Si mysafir · asgjë nuk ruhet</Text>
        </View>
      </SafeAreaView>

      {/* Fleta poshtë */}
      <Animated.View
        style={[
          s.sheetWrap,
          {
            transform: [{ translateY: sheetY.interpolate({ inputRange: [0, 1], outputRange: [0, 190] }) }],
          },
        ]}
      >
        <SafeAreaView edges={['bottom']}>
          <View style={[s.sheet, { backgroundColor: c.card }]}>
            <Pressable onPress={toggleSheet} hitSlop={16} accessibilityLabel="Hap ose mbyll panelin">
              <View style={s.grab} />
            </Pressable>

            <Text style={[s.h1, { color: c.ink }]}>38 komuna. Fillo me një.</Text>
            <Text style={[s.p, { color: c.muted }]}>Prek një pikë. 318 vende deri tani, pa llogari.</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.cards}
              snapToInterval={116}
              decelerationRate="fast"
            >
              {PLACES.map((p) => (
                <Pressable key={p.id} style={s.place} onPress={() => openPlace(p.id)}>
                  <Image
                    source={p.image}
                    style={[
                      s.photo,
                      active === p.id && { borderWidth: 3, borderColor: dark ? '#fff' : '#111' },
                    ]}
                  />
                  <Text style={[s.placeName, { color: c.ink }]}>{p.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, overflow: 'hidden' },

  pin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 9, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  top: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16, alignItems: 'center', gap: 12 },
  search: {
    width: '100%', height: 48, borderRadius: 24, flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingHorizontal: 16,
    shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  input: { flex: 1, fontSize: 16 },
  guest: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20,
  },
  guestText: { fontSize: 13, fontWeight: '600' },

  sheetWrap: { position: 'absolute', left: 8, right: 8, bottom: 0 },
  sheet: {
    borderRadius: 32, paddingTop: 10, paddingBottom: 20, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 15, shadowOffset: { width: 0, height: -6 },
    elevation: 8,
  },
  grab: { width: 38, height: 5, borderRadius: 3, backgroundColor: '#c9c9c5', alignSelf: 'center', marginBottom: 16 },
  h1: { fontSize: 25, fontWeight: '800', letterSpacing: -0.5, paddingHorizontal: 18 },
  p: { fontSize: 14.5, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 16, lineHeight: 20 },

  cards: { paddingHorizontal: 18, gap: 10 },
  place: { width: 106 },
  photo: { width: 106, height: 86, borderRadius: 18, marginBottom: 8 },
  placeName: { fontSize: 13, fontWeight: '700', lineHeight: 16 },
});