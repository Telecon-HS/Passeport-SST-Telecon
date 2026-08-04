/**
 * Synchronisation de l'état partagé.
 *
 * Le prototype fonctionne selon trois modes, dans cet ordre de préférence :
 *  1. « partagé »  — l'API /api/state répond : l'état est commun à tous les postes ;
 *  2. « local »    — l'API est indisponible mais localStorage fonctionne ;
 *  3. « mémoire »  — ni l'un ni l'autre : les changements durent le temps de la session.
 *
 * L'écriture est différée (debounce) pour éviter un appel réseau à chaque clic.
 */

export type SyncMode = "partagé" | "local" | "mémoire";

const ENDPOINT = "/api/state";
const WRITE_DELAY = 800;

let mode: SyncMode = "local";
let writeTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<(m: SyncMode) => void>();

export function getSyncMode(): SyncMode {
  return mode;
}

export function onSyncModeChange(fn: (m: SyncMode) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setMode(next: SyncMode) {
  if (mode === next) return;
  mode = next;
  listeners.forEach((fn) => fn(mode));
}

/** Charge l'état partagé. Renvoie null si le serveur n'est pas disponible. */
export async function loadSharedState<T>(): Promise<T | null> {
  try {
    const res = await fetch(ENDPOINT, { method: "GET" });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    setMode("partagé");
    return (json.state as T) ?? null;
  } catch {
    setMode("local");
    return null;
  }
}

/** Enregistre l'état partagé (différé). Sans effet si le serveur est indisponible. */
export function saveSharedState<T>(state: T): void {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(async () => {
    try {
      const res = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error(String(res.status));
      setMode("partagé");
    } catch {
      setMode("local");
    }
  }, WRITE_DELAY);
}

/** Efface l'état partagé côté serveur. */
export async function clearSharedState(): Promise<void> {
  try {
    await fetch(ENDPOINT, { method: "DELETE" });
  } catch {
    // ignoré : le repli local reste effacé par resetAll()
  }
}

export function setMemoryMode() {
  setMode("mémoire");
}
