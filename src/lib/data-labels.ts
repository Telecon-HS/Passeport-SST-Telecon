import type { TrainingModule } from "@/types";

/**
 * Traduction des libellés issus des données (catégories, dangers, postes).
 * Le dictionnaire ne contient que les clés `data.*` anglaises : en français,
 * la valeur d'origine est renvoyée telle quelle.
 */
export function makeDataLabel(t: (k: string) => string) {
  return (value: string) => {
    if (!value) return value;
    const key = `data.${value}`;
    const translated = t(key);
    return translated === key ? value : translated;
  };
}

/** Intitulé d'un module dans la langue courante. */
export function moduleTitle(m: TrainingModule, lang: string): string {
  return lang === "en" && m.titleEn ? m.titleEn : m.title;
}
