import { createContext, useContext } from 'react';

// Albanian first, English second. Every text on the site is written as t({ sq: '…', en: '…' }).
export type Lang = 'sq' | 'en';
export type Text = { sq: string; en: string };

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'sq', setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

/** Pick the text for the current language. */
export function useT() {
  const { lang } = useLang();
  return (text: Text) => text[lang];
}
