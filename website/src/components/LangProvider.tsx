import { useState, type ReactNode } from 'react';

import { LangContext, type Lang } from '../i18n';

/** Holds the chosen language for the whole site. Starts on Shqip. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('sq');
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}
