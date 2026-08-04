import type { Role } from "@/types";

export interface Account {
  username: string;
  password: string;
  role: Role;
  employeeId: string | null;
  displayName: string;
  title: string;
  /** Employés visibles par ce compte. null = tous. */
  scope: "self" | "team" | "all";
}

// Comptes de démonstration du prototype.
// ⚠️ Authentification côté client uniquement — voir README (section Sécurité).
export const accounts: Account[] = [
  {
    username: "alex.tremblay",
    password: "Telecon2026",
    role: "Employé",
    employeeId: "EMP001",
    displayName: "Alex Tremblay",
    title: "Monteur — Infra Québec",
    scope: "self",
  },
  {
    username: "jordan.lee",
    password: "Telecon2026",
    role: "Superviseur",
    employeeId: "EMP004",
    displayName: "Jordan Lee",
    title: "Superviseur — Infra Québec",
    scope: "team",
  },
  {
    username: "marc.simard",
    password: "Telecon2026",
    role: "Superviseur",
    employeeId: "EMP012",
    displayName: "Marc-André Simard",
    title: "Superviseur — I&R",
    scope: "team",
  },
  {
    username: "marie.fontaine",
    password: "Telecon2026",
    role: "Gestionnaire",
    employeeId: "EMP016",
    displayName: "Marie-Ève Fontaine",
    title: "Directrice Opérations",
    scope: "all",
  },
  {
    username: "renee.dube",
    password: "Telecon2026",
    role: "PASS SST",
    employeeId: null,
    displayName: "Renée Dubé",
    title: "PASS SST / HSBP",
    scope: "all",
  },
  {
    username: "isabelle.moreau",
    password: "Telecon2026",
    role: "RH",
    employeeId: null,
    displayName: "Isabelle Moreau",
    title: "RH — Talent et culture",
    scope: "all",
  },
];

export function findAccount(username: string, password: string): Account | null {
  const normalized = username.trim().toLowerCase();
  return (
    accounts.find((a) => a.username === normalized && a.password === password) ?? null
  );
}

export function accountByUsername(username: string): Account | null {
  return accounts.find((a) => a.username === username) ?? null;
}
