import { useSyncExternalStore } from 'react';

// Albanian first, English second. Every text in the app is written as t({ sq: '…', en: '…' }).
// The language lives in this tiny store (no extra package), so changing it re-renders every screen.
// It is not saved between app launches yet; saving it comes with the account (Card 2).
export type Lang = 'sq' | 'en';
export type Text = { sq: string; en: string };

let current: Lang = 'sq';
const listeners = new Set<() => void>();

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  listeners.forEach((l) => l());
}

export function getLang(): Lang {
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The current language; the component re-renders when it changes. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang);
}

/** Use inside components: const t = useT(); <Txt>{t({ sq: 'Vazhdo', en: 'Continue' })}</Txt> */
export function useT() {
  const lang = useLang();
  return (text: Text) => text[lang];
}
