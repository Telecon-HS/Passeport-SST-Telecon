// Couche de persistance tolérante aux pannes.
// Utilise localStorage quand il est disponible, sinon bascule en mémoire
// (mode aperçu, navigation privée, contextes sandboxés).

const memoryStore = new Map<string, string>();

let localStorageAvailable: boolean | null = null;

function hasLocalStorage(): boolean {
  if (localStorageAvailable !== null) return localStorageAvailable;
  try {
    const probe = "__psst_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    localStorageAvailable = true;
  } catch {
    localStorageAvailable = false;
  }
  return localStorageAvailable;
}

export const PREFIX = "psst:";

export function readValue<T>(key: string, fallback: T): T {
  const fullKey = PREFIX + key;
  try {
    const raw = hasLocalStorage() ? window.localStorage.getItem(fullKey) : memoryStore.get(fullKey) ?? null;
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeValue<T>(key: string, value: T): void {
  const fullKey = PREFIX + key;
  try {
    const raw = JSON.stringify(value);
    if (hasLocalStorage()) {
      window.localStorage.setItem(fullKey, raw);
    } else {
      memoryStore.set(fullKey, raw);
    }
  } catch {
    // Quota dépassé ou sérialisation impossible : on ignore silencieusement,
    // l'application continue de fonctionner avec l'état en mémoire.
  }
}

export function removeValue(key: string): void {
  const fullKey = PREFIX + key;
  try {
    if (hasLocalStorage()) {
      window.localStorage.removeItem(fullKey);
    } else {
      memoryStore.delete(fullKey);
    }
  } catch {
    // ignoré
  }
}

/** Indique si les données survivront à un rafraîchissement de page. */
export function isPersistent(): boolean {
  return hasLocalStorage();
}
