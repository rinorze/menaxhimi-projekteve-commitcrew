import { useState } from 'react';
import { TextInput, Platform } from 'react-native';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { minTouch, radius, text, useColors } from '@/theme/tokens';

const tr = (s: { sq: string; en: string }) => s.sq; // aplikacioni hapet në Shqip

function Progress({ step, total = 7 }: { step: number; total?: number }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < step ? c.label : c.fill }} />
      ))}
    </View>
  );
}

export default function SavePassport() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('rinor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');

  const input = { flex: 1, color: c.label, fontSize: 17, minHeight: minTouch };
  const row = (key: string, children: React.ReactNode, last = false) => (
    <View key={key} style={{ flexDirection: 'row', alignItems: 'center', minHeight: minTouch + 8, paddingHorizontal: 14, borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderBottomColor: c.separator }}>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.grouped }}>
      <ScrollView keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
        <Progress step={5} />

        {/* Pasaporta: pamje paraprake, vetëm formulari më poshtë është pjesa reale */}
        <View style={[styles.passport, { backgroundColor: c.tint }]}>
          <View style={[styles.avatar, { backgroundColor: c.onTint }]}>
            <Text style={{ fontSize: 30, color: c.tint }}>{(username[0] ?? '?').toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[text.caption, { color: c.onTint, opacity: 0.7, fontWeight: '700', letterSpacing: 1 }]}>PASAPORTA E KOSOVËS</Text>
            <Text style={[text.title2, { color: c.onTint }]}>{username || '—'}</Text>
            <Text style={[text.footnote, { color: c.onTint, opacity: 0.7 }]}>@{username || '—'}</Text>
            <Text style={[text.footnote, { color: c.onTint, marginTop: 6 }]}>{tr({ sq: 'E ruajtur: Kalaja e Novobërdës', en: 'Saved: Novobërda Castle' })}</Text>
          </View>
        </View>

        <Text style={[text.title1, { color: c.label, marginTop: 24 }]}>{tr({ sq: 'Ruaje pasaportën', en: 'Save your passport' })}</Text>
        <Text style={[text.subheadline, { color: c.label2, marginTop: 4 }]}>
          {tr({ sq: 'Novobërda hyn në listën tënde. Vulat, shokët dhe udhëtimet ruhen në çdo telefon.', en: 'Your stamps, friends and trips are kept on every phone.' })}
        </Text>

        <Pressable accessibilityRole="button" onPress={() => { /* Apple sign-in vjen me backend */ }}
          style={[styles.button, { backgroundColor: c.tint, marginTop: 16 }]}>
          <Text style={[text.headline, { color: c.onTint }]}>{Platform.OS === 'ios' ? '\uF8FF ' : ''}{tr({ sq: 'Vazhdo me Apple', en: 'Continue with Apple' })}</Text>
        </Pressable>

        <View style={{ marginTop: 16, backgroundColor: c.card, borderRadius: radius.card, overflow: 'hidden' }}>
          {row('u', <>
            <Text style={[text.body, { color: c.label, width: 110 }]}>{tr({ sq: 'Përdoruesi', en: 'Username' })}</Text>
            <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} style={input} />
            <Text style={[text.footnote, { color: c.green, fontWeight: '600' }]}>{tr({ sq: 'I lirë', en: 'Available' })}</Text>
          </>)}
          {row('e', <>
            <Text style={[text.body, { color: c.label, width: 110 }]}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
              placeholder="you@example.com" placeholderTextColor={c.label3} style={input} />
          </>)}
          {row('p', <>
            <Text style={[text.body, { color: c.label, width: 110 }]}>{tr({ sq: 'Fjalëkalimi', en: 'Password' })}</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry
              placeholder={tr({ sq: '8+ shenja', en: '8+ characters' })} placeholderTextColor={c.label3} style={input} />
          </>)}
          {row('y', <>
            <Text style={[text.body, { color: c.label, width: 110 }]}>{tr({ sq: 'Lindur', en: 'Born' })}</Text>
            <TextInput value={year} onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad"
              placeholder={tr({ sq: 'Viti', en: 'Year' })} placeholderTextColor={c.label3} style={input} />
          </>, true)}
        </View>

        <Text style={[text.caption, { color: c.label2, marginTop: 12 }]}>
          {tr({
            sq: 'Nën 16 vjeç? Shokët nuk e shohin kurrë vendndodhjen tënde. Mund ta fshish llogarinë dhe çdo foto kur të duash.',
            en: 'Under 16? Friends never see your location. You can delete your account and every photo whenever you want.',
          })}
        </Text>

        <Pressable onPress={() => router.push('/privacy')} accessibilityRole="button" style={[styles.button, { backgroundColor: c.tint, marginTop: 24 }]}>
          <Text style={[text.headline, { color: c.onTint }]}>{tr({ sq: 'Ruaje pasaportën time', en: 'Save my passport' })}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: minTouch + 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  passport: { marginTop: 24, marginHorizontal: 8, borderRadius: radius.sheet, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
});
