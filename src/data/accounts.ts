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
    username: "alex.t",
    password: "Telecon2026",
    role: "Employé",
    employeeId: "EMP001",
    displayName: "Alex T.",
    title: "Monteur — Infrastructure QC",
    scope: "self",
  },
  {
    username: "jordan.l",
    password: "Telecon2026",
    role: "Superviseur",
    employeeId: "EMP004",
    displayName: "Jordan L.",
    title: "Superviseur — Infrastructure QC",
    scope: "team",
  },
  {
    username: "marc.s",
    password: "Telecon2026",
    role: "Superviseur",
    employeeId: "EMP012",
    displayName: "Marc-André S.",
    title: "Superviseur — I&R Ontario",
    scope: "team",
  },
  {
    username: "marie.f",
    password: "Telecon2026",
    role: "Gestionnaire",
    employeeId: "EMP016",
    displayName: "Marie-Ève F.",
    title: "Directrice Opérations",
    scope: "all",
  },
  {
    username: "renee.d",
    password: "Telecon2026",
    role: "PASS SST",
    employeeId: null,
    displayName: "Renée D.",
    title: "Partenaire d'affaires SST (PASS)",
    scope: "all",
  },
  {
    username: "jeff.v",
    password: "Telecon2026",
    role: "Gestionnaire programme SST",
    employeeId: null,
    displayName: "Jeff Van Allen",
    title: "Gestionnaire du programme de santé et sécurité",
    scope: "all",
  },
  {
    username: "isabelle.m",
    password: "Telecon2026",
    role: "RH",
    employeeId: null,
    displayName: "Isabelle M.",
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
