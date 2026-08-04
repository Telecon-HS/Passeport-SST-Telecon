import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { Role, Employee } from "@/types";
import { useAuth } from "./auth-context";
import { useDataStore } from "./data-store";
import { employees } from "@/data/employees";

export type ScreenId =
  | "home"
  | "employeeDashboard"
  | "passport"
  | "supervisorDashboard"
  | "psfce"
  | "managerDashboard"
  | "passsstDashboard"
  | "hrDashboard"
  | "trainingCenter"
  | "matrix"
  | "powerbi"
  | "evidenceLibrary"
  | "activity"
  | "resourceManager"
  | "pathBuilder";

const defaultScreenByRole: Record<Role, ScreenId> = {
  "Employé": "home",
  "Superviseur": "home",
  "Gestionnaire": "home",
  "PASS SST": "home",
  "Gestionnaire programme SST": "home",
  "RH": "home",
};

interface Persona {
  employeeId: string | null;
  displayName: string;
  title: string;
}

interface AppContextValue {
  role: Role;
  persona: Persona;
  screen: ScreenId;
  setScreen: (s: ScreenId) => void;
  focusEmployeeId: string | null;
  setFocusEmployeeId: (id: string | null) => void;
  navigateToPassport: (employeeId: string) => void;
  /** Employés que le compte connecté a le droit de consulter. */
  visibleEmployees: Employee[];
  canViewEmployee: (id: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { account } = useAuth();
  const { preferences, setPreferences } = useDataStore();

  if (!account) throw new Error("AppProvider requiert un compte authentifié");

  const visibleEmployees = useMemo<Employee[]>(() => {
    if (account.scope === "all") return employees;
    if (account.scope === "team") {
      return employees.filter(
        (e) => e.manager === account.displayName || e.id === account.employeeId
      );
    }
    return employees.filter((e) => e.id === account.employeeId);
  }, [account]);

  const allowedIds = useMemo(
    () => new Set(visibleEmployees.map((e) => e.id)),
    [visibleEmployees]
  );

  const initialScreen = useMemo<ScreenId>(() => {
    const saved = preferences.lastScreen as ScreenId | null;
    return saved ?? defaultScreenByRole[account.role];
  }, [account.role]);

  const [screen, setScreenState] = useState<ScreenId>(initialScreen);
  const [focusEmployeeId, setFocusEmployeeId] = useState<string | null>(
    account.employeeId ?? visibleEmployees[0]?.id ?? null
  );

  // Réinitialise la vue quand le compte change (déconnexion / reconnexion).
  useEffect(() => {
    setScreenState(preferences.lastScreen as ScreenId ?? defaultScreenByRole[account.role]);
    setFocusEmployeeId(account.employeeId ?? visibleEmployees[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.username]);

  const setScreen = (s: ScreenId) => {
    setScreenState(s);
    setPreferences({ lastScreen: s });
  };

  const canViewEmployee = (id: string) => allowedIds.has(id);

  const navigateToPassport = (employeeId: string) => {
    if (!allowedIds.has(employeeId)) return;
    setFocusEmployeeId(employeeId);
    setScreen("passport");
  };

  const persona: Persona = {
    employeeId: account.employeeId,
    displayName: account.displayName,
    title: account.title,
  };

  const value = useMemo(
    () => ({
      role: account.role,
      persona,
      screen,
      setScreen,
      focusEmployeeId,
      setFocusEmployeeId,
      navigateToPassport,
      visibleEmployees,
      canViewEmployee,
    }),
    [account, screen, focusEmployeeId, visibleEmployees]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp doit être utilisé dans un AppProvider");
  return ctx;
}
