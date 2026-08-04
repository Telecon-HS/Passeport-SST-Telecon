import {
  LayoutGrid,
  CreditCard,
  Users,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  UserCog,
  GraduationCap,
  Grid3x3,
  MonitorSmartphone,
  FolderCheck,
  History,
  Home,
  Link2,
  Route,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Role } from "@/types";
import type { ScreenId } from "@/lib/app-context";

export interface NavItem {
  id: ScreenId;
  label: string;
  icon: LucideIcon;
  roles: Role[];
  section: "principal" | "outils";
}

export const navItems: NavItem[] = [
  { id: "home", label: "Accueil", icon: Home, roles: ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "Gestionnaire programme SST", "RH"], section: "principal" },
  { id: "employeeDashboard", label: "Mon tableau de bord", icon: LayoutGrid, roles: ["Employé"], section: "principal" },
  { id: "passport", label: "Passeport numérique", icon: CreditCard, roles: ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "Gestionnaire programme SST", "RH"], section: "principal" },
  { id: "supervisorDashboard", label: "Tableau de bord équipe", icon: Users, roles: ["Superviseur"], section: "principal" },
  { id: "psfce", label: "PSFCE", icon: ClipboardList, roles: ["Superviseur", "PASS SST"], section: "principal" },
  { id: "managerDashboard", label: "Tableau de bord gestion", icon: BarChart3, roles: ["Gestionnaire"], section: "principal" },
  { id: "passsstDashboard", label: "Tableau de bord PASS SST", icon: ShieldCheck, roles: ["PASS SST"], section: "principal" },
  { id: "hrDashboard", label: "Tableau de bord RH", icon: UserCog, roles: ["RH"], section: "principal" },
  { id: "trainingCenter", label: "Centre de formation", icon: GraduationCap, roles: ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "Gestionnaire programme SST", "RH"], section: "outils" },
  { id: "matrix", label: "Matrice de formation", icon: Grid3x3, roles: ["Superviseur", "Gestionnaire", "PASS SST", "Gestionnaire programme SST"], section: "outils" },
  { id: "powerbi", label: "Vue Power BI", icon: MonitorSmartphone, roles: ["Gestionnaire", "PASS SST"], section: "outils" },
  { id: "evidenceLibrary", label: "Bibliothèque de preuves", icon: FolderCheck, roles: ["Gestionnaire", "PASS SST", "RH"], section: "outils" },
  { id: "activity", label: "Journal d'activité", icon: History, roles: ["Superviseur", "Gestionnaire", "PASS SST", "Gestionnaire programme SST", "RH"], section: "outils" },
  { id: "resourceManager", label: "Ressources de formation", icon: Link2, roles: ["Gestionnaire programme SST", "PASS SST"], section: "outils" },
  { id: "pathBuilder", label: "Parcours de formation", icon: Route, roles: ["PASS SST"], section: "outils" },
];

export const roleList: Role[] = ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "Gestionnaire programme SST", "RH"];

/** Intitulé complet de chaque rôle, pour lever l'ambiguïté des sigles. */
export const roleFullName: Record<Role, string> = {
  "Employé": "Employé",
  "Superviseur": "Superviseur",
  "Gestionnaire": "Gestionnaire opérationnel",
  "PASS SST": "Partenaire d'affaires SST — Health & Safety Business Partner (HSBP)",
  "Gestionnaire programme SST": "Gestionnaire du programme de santé et sécurité",
  "RH": "Ressources humaines",
};
