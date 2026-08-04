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
  Home,
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
  { id: "home", label: "Accueil", icon: Home, roles: ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "RH"], section: "principal" },
  { id: "employeeDashboard", label: "Mon tableau de bord", icon: LayoutGrid, roles: ["Employé"], section: "principal" },
  { id: "passport", label: "Passeport numérique", icon: CreditCard, roles: ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "RH"], section: "principal" },
  { id: "supervisorDashboard", label: "Tableau de bord équipe", icon: Users, roles: ["Superviseur"], section: "principal" },
  { id: "psfce", label: "PSFCE", icon: ClipboardList, roles: ["Superviseur", "PASS SST"], section: "principal" },
  { id: "managerDashboard", label: "Tableau de bord gestion", icon: BarChart3, roles: ["Gestionnaire"], section: "principal" },
  { id: "passsstDashboard", label: "Tableau de bord PASS SST", icon: ShieldCheck, roles: ["PASS SST"], section: "principal" },
  { id: "hrDashboard", label: "Tableau de bord RH", icon: UserCog, roles: ["RH"], section: "principal" },
  { id: "trainingCenter", label: "Centre de formation", icon: GraduationCap, roles: ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "RH"], section: "outils" },
  { id: "matrix", label: "Matrice de formation", icon: Grid3x3, roles: ["Superviseur", "Gestionnaire", "PASS SST"], section: "outils" },
  { id: "powerbi", label: "Vue Power BI", icon: MonitorSmartphone, roles: ["Gestionnaire", "PASS SST"], section: "outils" },
  { id: "evidenceLibrary", label: "Bibliothèque de preuves", icon: FolderCheck, roles: ["Gestionnaire", "PASS SST", "RH"], section: "outils" },
];

export const roleList: Role[] = ["Employé", "Superviseur", "Gestionnaire", "PASS SST", "RH"];
