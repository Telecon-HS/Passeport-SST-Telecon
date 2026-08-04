import React, { createContext, useContext, useState, useMemo } from "react";
import type { Role } from "@/types";

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
  | "evidenceLibrary";

interface Persona {
  employeeId: string | null;
  displayName: string;
  title: string;
}

const personaByRole: Record<Role, Persona> = {
  "Employé": { employeeId: "EMP001", displayName: "Alex Tremblay", title: "Monteur — Infra Québec" },
  "Superviseur": { employeeId: "EMP004", displayName: "Jordan Lee", title: "Superviseur — Infra Québec" },
  "Gestionnaire": { employeeId: "EMP016", displayName: "Marie-Ève Fontaine", title: "Directrice Opérations" },
  "PASS SST": { employeeId: null, displayName: "Renée Dubé", title: "PASS SST / HSBP" },
  "RH": { employeeId: null, displayName: "Isabelle Moreau", title: "RH — Talent et culture" },
};

interface AppContextValue {
  role: Role;
  setRole: (r: Role) => void;
  screen: ScreenId;
  setScreen: (s: ScreenId) => void;
  persona: Persona;
  focusEmployeeId: string | null;
  setFocusEmployeeId: (id: string | null) => void;
  navigateToPassport: (employeeId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("Employé");
  const [screen, setScreen] = useState<ScreenId>("home");
  const [focusEmployeeId, setFocusEmployeeId] = useState<string | null>("EMP001");

  const setRole = (r: Role) => {
    setRoleState(r);
    const p = personaByRole[r];
    setFocusEmployeeId(p.employeeId ?? null);
    const defaultScreen: Record<Role, ScreenId> = {
      "Employé": "employeeDashboard",
      "Superviseur": "supervisorDashboard",
      "Gestionnaire": "managerDashboard",
      "PASS SST": "passsstDashboard",
      "RH": "hrDashboard",
    };
    setScreen(defaultScreen[r]);
  };

  const navigateToPassport = (employeeId: string) => {
    setFocusEmployeeId(employeeId);
    setScreen("passport");
  };

  const persona = personaByRole[role];

  const value = useMemo(
    () => ({ role, setRole, screen, setScreen, persona, focusEmployeeId, setFocusEmployeeId, navigateToPassport }),
    [role, screen, persona, focusEmployeeId]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
