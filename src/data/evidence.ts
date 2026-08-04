import type { Evidence, OnboardingCase } from "@/types";

export const evidenceLibrary: Evidence[] = [
  { id: "EV-001", employeeId: "EMP001", type: "Quiz", linkedTo: "1-Telecon Orientation FR", label: "Quiz orientation — 92 %", date: "2026-08-11", auditReady: true },
  { id: "EV-002", employeeId: "EMP001", type: "Quiz", linkedTo: "SIMDUT Video FR", label: "Quiz SIMDUT — 88 %", date: "2026-08-12", auditReady: true },
  { id: "EV-003", employeeId: "EMP001", type: "Observation", linkedTo: "PSFCE-001 Excavation sécuritaire", label: "Observation terrain — tranchée peu profonde", date: "2026-08-20", auditReady: true },
  { id: "EV-004", employeeId: "EMP001", type: "Signature", linkedTo: "Orientation propre au site", label: "Fiche orientation chantier signée", date: "2026-08-13", auditReady: true },
  { id: "EV-005", employeeId: "EMP002", type: "Quiz", linkedTo: "1-Telecon Orientation FR", label: "Quiz orientation — 65 %", date: "2026-08-11", auditReady: false },
  { id: "EV-006", employeeId: "EMP003", type: "Certificate", linkedTo: "Reading and Verifying Utility Locates", label: "Certificat compétence localisation", date: "2026-02-14", auditReady: true },
  { id: "EV-007", employeeId: "EMP003", type: "Observation", linkedTo: "PSFCE-007 Localisation", label: "Validation finale superviseur", date: "2026-03-01", auditReady: true },
  { id: "EV-008", employeeId: "EMP006", type: "Certificate", linkedTo: "Équipement lourd", label: "Carte autorisation équipement", date: "2025-08-30", auditReady: true },
  { id: "EV-009", employeeId: "EMP008", type: "Certificate", linkedTo: "Travail en hauteur / nacelle", label: "Certificat travail en hauteur", date: "2025-02-20", auditReady: true },
  { id: "EV-010", employeeId: "EMP009", type: "Quiz", linkedTo: "1-Telecon Orientation FR", label: "Quiz orientation — 100 %", date: "2026-06-02", auditReady: true },
  { id: "EV-011", employeeId: "EMP011", type: "File", linkedTo: "Chariot élévateur", label: "Autorisation interne signée", date: "2026-06-05", auditReady: true },
  { id: "EV-012", employeeId: "EMP015", type: "Quiz", linkedTo: "1-Telecon Orientation FR", label: "Quiz orientation — non complété", date: "2026-08-01", auditReady: false },
  { id: "EV-013", employeeId: "EMP005", type: "Signature", linkedTo: "Orientation propre au site", label: "Fiche orientation chantier signée", date: "2026-07-21", auditReady: true },
  { id: "EV-014", employeeId: "EMP007", type: "Quiz", linkedTo: "Sécurité électrique dans les télécommunications", label: "Quiz sécurité électrique — 74 %", date: "2026-08-02", auditReady: true },
  { id: "EV-015", employeeId: "EMP010", type: "Observation", linkedTo: "PSFCE-005 Signalisation", label: "Observation initiale — en attente carte PCCC", date: "2026-08-15", auditReady: false },
];

export const evidenceForEmployee = (employeeId: string) =>
  evidenceLibrary.filter((e) => e.employeeId === employeeId);

export const onboardingCases: OnboardingCase[] = [
  {
    id: "OC-001", employeeId: "EMP001", receivedDate: "2026-08-04", status: "En validation",
    steps: [
      { label: "Courriel RH reçu", done: true, date: "2026-08-04" },
      { label: "Profil Passeport SST créé", done: true, date: "2026-08-05" },
      { label: "Vérification Mintz", done: true, date: "2026-08-06" },
      { label: "Dossier de conduite validé", done: true, date: "2026-08-07" },
      { label: "Matrice de formation assignée", done: true, date: "2026-08-08" },
      { label: "Orientation Telecon complétée", done: true, date: "2026-08-11" },
      { label: "Orientation BU complétée", done: false },
      { label: "PSFCE amorcé", done: true, date: "2026-08-20" },
    ],
  },
  {
    id: "OC-002", employeeId: "EMP002", receivedDate: "2026-08-04", status: "Formation assignée",
    steps: [
      { label: "Courriel RH reçu", done: true, date: "2026-08-04" },
      { label: "Profil Passeport SST créé", done: true, date: "2026-08-05" },
      { label: "Vérification Mintz", done: false },
      { label: "Dossier de conduite validé", done: false },
      { label: "Matrice de formation assignée", done: true, date: "2026-08-08" },
      { label: "Orientation Telecon complétée", done: false },
      { label: "Orientation BU complétée", done: false },
      { label: "PSFCE amorcé", done: false },
    ],
  },
  {
    id: "OC-003", employeeId: "EMP007", receivedDate: "2026-07-21", status: "En validation",
    steps: [
      { label: "Courriel RH reçu", done: true, date: "2026-07-21" },
      { label: "Profil Passeport SST créé", done: true, date: "2026-07-22" },
      { label: "Vérification Mintz", done: false },
      { label: "Dossier de conduite validé", done: true, date: "2026-07-24" },
      { label: "Matrice de formation assignée", done: true, date: "2026-07-25" },
      { label: "Orientation Telecon complétée", done: true, date: "2026-07-27" },
      { label: "Orientation BU complétée", done: true, date: "2026-07-29" },
      { label: "PSFCE amorcé", done: true, date: "2026-08-02" },
    ],
  },
  {
    id: "OC-004", employeeId: "EMP015", receivedDate: "2026-08-01", status: "Nouveau",
    steps: [
      { label: "Courriel RH reçu", done: true, date: "2026-08-01" },
      { label: "Profil Passeport SST créé", done: true, date: "2026-08-01" },
      { label: "Vérification Mintz", done: false },
      { label: "Dossier de conduite validé", done: false },
      { label: "Matrice de formation assignée", done: false },
      { label: "Orientation Telecon complétée", done: false },
      { label: "Orientation BU complétée", done: false },
      { label: "PSFCE amorcé", done: false },
    ],
  },
  {
    id: "OC-005", employeeId: "EMP010", receivedDate: "2026-07-06", status: "En validation",
    steps: [
      { label: "Courriel RH reçu", done: true, date: "2026-07-06" },
      { label: "Profil Passeport SST créé", done: true, date: "2026-07-07" },
      { label: "Vérification Mintz", done: true, date: "2026-07-08" },
      { label: "Dossier de conduite validé", done: false },
      { label: "Matrice de formation assignée", done: true, date: "2026-07-09" },
      { label: "Orientation Telecon complétée", done: true, date: "2026-07-10" },
      { label: "Orientation BU complétée", done: true, date: "2026-07-14" },
      { label: "PSFCE amorcé", done: true, date: "2026-08-15" },
    ],
  },
];
