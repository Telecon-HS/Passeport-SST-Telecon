import type { Authorization } from "@/types";

export const authorizations: Authorization[] = [
  { id: "AUTH-001", employeeId: "EMP001", activity: "Excavation", status: "Supervised", validatedBy: "Jordan Lee", validUntil: "2027-02-01", linkedTqt: "Excavation / tranchées" },
  { id: "AUTH-002", employeeId: "EMP001", activity: "Travail près énergie", status: "Not authorized", validatedBy: null, validUntil: null, linkedTqt: "Électricité" },
  { id: "AUTH-003", employeeId: "EMP002", activity: "Outils motorisés", status: "Not authorized", validatedBy: null, validUntil: null, linkedTqt: "Outils" },
  { id: "AUTH-004", employeeId: "EMP002", activity: "Excavation", status: "Not authorized", validatedBy: null, validUntil: null, linkedTqt: "Excavation / tranchées" },
  { id: "AUTH-005", employeeId: "EMP003", activity: "Utility Locates", status: "Authorized", validatedBy: "Nadia Boucher", validUntil: "2027-11-03", linkedTqt: "Excavation / tranchées" },
  { id: "AUTH-006", employeeId: "EMP004", activity: "Supervision chantier", status: "Authorized", validatedBy: "Marie-Ève Fontaine", validUntil: "2027-03-15", linkedTqt: "Tous" },
  { id: "AUTH-007", employeeId: "EMP005", activity: "Signalisation / zone d'exclusion", status: "Supervised", validatedBy: "Jordan Lee", validUntil: "2026-10-20", linkedTqt: "Objets tombés / zone exclusion" },
  { id: "AUTH-008", employeeId: "EMP006", activity: "Équipement lourd", status: "Authorized", validatedBy: "Jordan Lee", validUntil: "2026-08-30", linkedTqt: "Équipement mobile" },
  { id: "AUTH-009", employeeId: "EMP007", activity: "Travail près énergie", status: "Not authorized", validatedBy: null, validUntil: null, linkedTqt: "Électricité" },
  { id: "AUTH-010", employeeId: "EMP008", activity: "Travail en hauteur", status: "Authorized", validatedBy: "Marc-André Simard", validUntil: "2027-02-18", linkedTqt: "Travail en hauteur" },
  { id: "AUTH-011", employeeId: "EMP009", activity: "Travail bureau / conception", status: "Authorized", validatedBy: "Nadia Boucher", validUntil: null, linkedTqt: "Tous" },
  { id: "AUTH-012", employeeId: "EMP010", activity: "Circulation / signaleur", status: "Not authorized", validatedBy: null, validUntil: null, linkedTqt: "Transport / conduite" },
  { id: "AUTH-013", employeeId: "EMP011", activity: "Chariot élévateur", status: "Authorized", validatedBy: "Renée Lavoie", validUntil: "2026-09-05", linkedTqt: "Équipement mobile" },
  { id: "AUTH-014", employeeId: "EMP015", activity: "Utility Locates", status: "Not authorized", validatedBy: null, validUntil: null, linkedTqt: "Excavation / tranchées" },
  { id: "AUTH-015", employeeId: "EMP006", activity: "Excavation", status: "Authorized", validatedBy: "Jordan Lee", validUntil: "2026-08-15", linkedTqt: "Excavation / tranchées" },
];

export const authorizationsForEmployee = (employeeId: string) =>
  authorizations.filter((a) => a.employeeId === employeeId);
