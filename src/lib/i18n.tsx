import React, { createContext, useContext, useMemo, useCallback, useState } from "react";
import { dictionary } from "./dictionary";
import type { Lang } from "./dictionary";
import { readValue, writeValue } from "./storage";

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const LANG_KEY = "lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Réglage de l'appareil, pas du compte : la langue choisie avant connexion
  // reste active après connexion.
  const [lang, setLangState] = useState<Lang>(() => readValue<Lang>(LANG_KEY, "fr"));

  const setLang = useCallback((l: Lang) => {
    writeValue(LANG_KEY, l);
    setLangState(l);
  }, []);

  /** Traduction avec repli : langue courante → français → clé brute. */
  const t = useCallback(
    (key: string) => dictionary[lang][key] ?? dictionary.fr[key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n doit être utilisé dans un I18nProvider");
  return ctx;
}

/** Raccourci pour les composants qui n'ont besoin que de traduire. */
export function useT() {
  return useI18n().t;
}
