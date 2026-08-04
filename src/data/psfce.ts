import type { PSFCE } from "@/types";

export const psfceRecords: PSFCE[] = [
  {
    id: "PSFCE-001", employeeId: "EMP001", competency: "Excavation sécuritaire", mentor: "Olivier Bernard",
    status: "In progress", level: "Intermediate",
    observations: [
      "Respecte les distances de sécurité autour de la tranchée.",
      "Doit améliorer la communication avec le signaleur.",
    ],
    steps: [
      { label: "Orientation excavation complétée", done: true },
      { label: "Observation initiale par mentor", done: true },
      { label: "Démonstration en tranchée peu profonde", done: true },
      { label: "Démonstration en tranchée avec services publics", done: false },
      { label: "Validation finale superviseur", done: false },
    ],
  },
  {
    id: "PSFCE-002", employeeId: "EMP002", competency: "Utilisation outils motorisés", mentor: "À assigner",
    status: "Not started", level: "Beginner",
    observations: [],
    steps: [
      { label: "Orientation outils complétée", done: false },
      { label: "Mentor assigné", done: false },
      { label: "Démonstration supervisée", done: false },
      { label: "Validation finale superviseur", done: false },
    ],
  },
  {
    id: "PSFCE-003", employeeId: "EMP005", competency: "Signalisation et zone d'exclusion", mentor: "Jordan Lee",
    status: "In progress", level: "Beginner",
    observations: ["Bonne compréhension théorique, pratique à renforcer."],
    steps: [
      { label: "Orientation site complétée", done: true },
      { label: "Observation initiale par mentor", done: true },
      { label: "Démonstration terrain", done: false },
      { label: "Validation finale superviseur", done: false },
    ],
  },
  {
    id: "PSFCE-004", employeeId: "EMP007", competency: "Sécurité électrique - installations IR", mentor: "Marc-André Simard",
    status: "In progress", level: "Beginner",
    observations: ["Nécessite supervision rapprochée près des sources d'énergie."],
    steps: [
      { label: "Formation électrique complétée", done: true },
      { label: "Observation initiale par mentor", done: false },
      { label: "Démonstration supervisée", done: false },
      { label: "Validation finale superviseur", done: false },
    ],
  },
  {
    id: "PSFCE-005", employeeId: "EMP010", competency: "Sécurité routière et signalisation terrain", mentor: "Nadia Boucher",
    status: "Blocked", level: "Beginner",
    observations: ["Bloqué en attente de la carte de signaleur (PCCC)."],
    steps: [
      { label: "Formation TCP/signaleur complétée", done: false },
      { label: "Carte de compétence obtenue", done: false },
      { label: "Démonstration terrain", done: false },
      { label: "Validation finale superviseur", done: false },
    ],
  },
  {
    id: "PSFCE-006", employeeId: "EMP015", competency: "Lecture et vérification des localisations", mentor: "Camille Roy",
    status: "Not started", level: "Beginner",
    observations: [],
    steps: [
      { label: "Orientation localisation complétée", done: false },
      { label: "Mentor assigné", done: true },
      { label: "Démonstration supervisée", done: false },
      { label: "Validation finale superviseur", done: false },
    ],
  },
  {
    id: "PSFCE-007", employeeId: "EMP003", competency: "Lecture et vérification des localisations", mentor: "Nadia Boucher",
    status: "Completed", level: "Competent",
    observations: ["Compétence démontrée de façon constante sur 3 chantiers.", "Autorisation recommandée."],
    steps: [
      { label: "Orientation localisation complétée", done: true },
      { label: "Observation initiale par mentor", done: true },
      { label: "Démonstration supervisée", done: true },
      { label: "Validation finale superviseur", done: true },
    ],
  },
];
