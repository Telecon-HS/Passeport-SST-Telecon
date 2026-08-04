import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import type { PSFCE, Authorization } from "@/types";
import { psfceRecords as seedPsfce } from "@/data/psfce";
import { authorizations as seedAuthorizations } from "@/data/authorizations";
import { readValue, writeValue, removeValue, isPersistent } from "./storage";
import { loadSharedState, saveSharedState, clearSharedState, setMemoryMode } from "./sync";
import { useAuth } from "./auth-context";

const PSFCE_KEY = "data:psfce";
const AUTH_KEY = "data:authorizations";
const TRAINING_KEY = "data:trainingOverrides";
const ACTIVITY_KEY = "data:activity";

export interface ActivityEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
}

export interface UserPreferences {
  lastScreen: string | null;
  density: "confortable" | "compacte";
  pinnedEmployees: string[];
}

const defaultPreferences: UserPreferences = {
  lastScreen: null,
  density: "confortable",
  pinnedEmployees: [],
};

/** État d'une formation surchargé par l'utilisateur (ex. module marqué complété). */
export type TrainingOverrides = Record<string, "Complété" | "En cours">;

interface DataStoreValue {
  psfce: PSFCE[];
  authorizations: Authorization[];
  trainingOverrides: TrainingOverrides;
  activity: ActivityEntry[];
  preferences: UserPreferences;

  togglePsfceStep: (psfceId: string, index: number) => void;
  addPsfce: (record: PSFCE) => void;
  addPsfceObservation: (psfceId: string, note: string) => void;
  grantAuthorization: (authorizationId: string, validatedBy: string) => void;
  markTrainingComplete: (employeeId: string, moduleId: string) => void;
  setPreferences: (patch: Partial<UserPreferences>) => void;
  resetAll: () => void;
  /** true tant que l'état partagé n'a pas été récupéré du serveur. */
  loading: boolean;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

function trainingKey(employeeId: string, moduleId: string) {
  return `${employeeId}::${moduleId}`;
}

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const { account } = useAuth();
  const actor = account?.displayName ?? "Système";
  const prefsKey = `prefs:${account?.username ?? "anonyme"}`;

  const [psfce, setPsfce] = useState<PSFCE[]>(() => readValue<PSFCE[]>(PSFCE_KEY, seedPsfce));
  const [authorizations, setAuthorizations] = useState<Authorization[]>(() =>
    readValue<Authorization[]>(AUTH_KEY, seedAuthorizations)
  );
  const [trainingOverrides, setTrainingOverrides] = useState<TrainingOverrides>(() =>
    readValue<TrainingOverrides>(TRAINING_KEY, {})
  );
  const [activity, setActivity] = useState<ActivityEntry[]>(() => readValue<ActivityEntry[]>(ACTIVITY_KEY, []));
  const [preferences, setPreferencesState] = useState<UserPreferences>(() =>
    readValue<UserPreferences>(prefsKey, defaultPreferences)
  );

  const [loading, setLoading] = useState(true);

  // Hydratation : l'état partagé du serveur, s'il existe, fait autorité sur le local.
  useEffect(() => {
    let cancelled = false;
    if (!isPersistent()) setMemoryMode();
    loadSharedState<{
      psfce: PSFCE[];
      authorizations: Authorization[];
      trainingOverrides: TrainingOverrides;
      activity: ActivityEntry[];
    }>().then((remote) => {
      if (cancelled) return;
      if (remote) {
        if (remote.psfce) { setPsfce(remote.psfce); writeValue(PSFCE_KEY, remote.psfce); }
        if (remote.authorizations) { setAuthorizations(remote.authorizations); writeValue(AUTH_KEY, remote.authorizations); }
        if (remote.trainingOverrides) { setTrainingOverrides(remote.trainingOverrides); writeValue(TRAINING_KEY, remote.trainingOverrides); }
        if (remote.activity) { setActivity(remote.activity); writeValue(ACTIVITY_KEY, remote.activity); }
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Recharge les préférences quand l'utilisateur connecté change.
  useEffect(() => {
    setPreferencesState(readValue<UserPreferences>(prefsKey, defaultPreferences));
  }, [prefsKey]);

  // Réplication vers l'état partagé (différée) dès que les données métier changent.
  useEffect(() => {
    if (loading) return;
    saveSharedState({ psfce, authorizations, trainingOverrides, activity });
  }, [psfce, authorizations, trainingOverrides, activity, loading]);

  const log = useCallback(
    (action: string, target: string) => {
      const entry: ActivityEntry = {
        id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        at: new Date().toISOString(),
        actor,
        action,
        target,
      };
      setActivity((prev) => {
        const next = [entry, ...prev].slice(0, 200);
        writeValue(ACTIVITY_KEY, next);
        return next;
      });
    },
    [actor]
  );

  const togglePsfceStep = useCallback(
    (psfceId: string, index: number) => {
      setPsfce((prev) => {
        const next = prev.map((p) => {
          if (p.id !== psfceId) return p;
          const steps = p.steps.map((s, i) => (i === index ? { ...s, done: !s.done } : s));
          const doneAll = steps.every((s) => s.done);
          const anyDone = steps.some((s) => s.done);
          const status: PSFCE["status"] = doneAll ? "Completed" : anyDone ? "In progress" : "Not started";
          const level: PSFCE["level"] = doneAll ? "Competent" : anyDone ? "Intermediate" : "Beginner";
          return { ...p, steps, status, level };
        });
        writeValue(PSFCE_KEY, next);
        return next;
      });
      log("Mise à jour d'une étape PSFCE", psfceId);
    },
    [log]
  );

  const addPsfce = useCallback(
    (record: PSFCE) => {
      setPsfce((prev) => {
        const next = [...prev, record];
        writeValue(PSFCE_KEY, next);
        return next;
      });
      log("Création d'un PSFCE", `${record.id} — ${record.competency}`);
    },
    [log]
  );

  const addPsfceObservation = useCallback(
    (psfceId: string, note: string) => {
      setPsfce((prev) => {
        const next = prev.map((p) =>
          p.id === psfceId ? { ...p, observations: [...p.observations, note] } : p
        );
        writeValue(PSFCE_KEY, next);
        return next;
      });
      log("Ajout d'une observation terrain", psfceId);
    },
    [log]
  );

  const grantAuthorization = useCallback(
    (authorizationId: string, validatedBy: string) => {
      setAuthorizations((prev) => {
        const next = prev.map((a) =>
          a.id === authorizationId
            ? { ...a, status: "Authorized" as const, validatedBy, validUntil: "2027-12-31" }
            : a
        );
        writeValue(AUTH_KEY, next);
        return next;
      });
      log("Autorisation de travail accordée", authorizationId);
    },
    [log]
  );

  const markTrainingComplete = useCallback(
    (employeeId: string, moduleId: string) => {
      setTrainingOverrides((prev) => {
        const next = { ...prev, [trainingKey(employeeId, moduleId)]: "Complété" as const };
        writeValue(TRAINING_KEY, next);
        return next;
      });
      log("Formation marquée complétée", `${employeeId} / ${moduleId}`);
    },
    [log]
  );

  const setPreferences = useCallback(
    (patch: Partial<UserPreferences>) => {
      setPreferencesState((prev) => {
        const next = { ...prev, ...patch };
        writeValue(prefsKey, next);
        return next;
      });
    },
    [prefsKey]
  );

  const resetAll = useCallback(() => {
    void clearSharedState();
    removeValue(PSFCE_KEY);
    removeValue(AUTH_KEY);
    removeValue(TRAINING_KEY);
    removeValue(ACTIVITY_KEY);
    removeValue(prefsKey);
    setPsfce(seedPsfce);
    setAuthorizations(seedAuthorizations);
    setTrainingOverrides({});
    setActivity([]);
    setPreferencesState(defaultPreferences);
  }, [prefsKey]);

  const value = useMemo(
    () => ({
      psfce,
      authorizations,
      trainingOverrides,
      activity,
      preferences,
      togglePsfceStep,
      addPsfce,
      addPsfceObservation,
      grantAuthorization,
      markTrainingComplete,
      setPreferences,
      resetAll,
      loading,
    }),
    [
      psfce,
      authorizations,
      trainingOverrides,
      activity,
      preferences,
      togglePsfceStep,
      addPsfce,
      addPsfceObservation,
      grantAuthorization,
      markTrainingComplete,
      setPreferences,
      resetAll,
      loading,
    ]
  );

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore doit être utilisé dans un DataStoreProvider");
  return ctx;
}

export { trainingKey };
