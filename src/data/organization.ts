// Référentiel organisationnel canonique du Passeport SST.
// Source : programmes d'orientation SST Telecon (HSE-00 / HSE-800) et documents corporatifs.
// Hiérarchie retenue : Business Unit → Région → Poste.

/** Niveau 1 — Business Units opérationnelles. */
export const businessUnits = [
  "Infrastructure",
  "I&R",
  "Structured Cabling",
  "Design",
  "Locate",
  "Warehouse",
] as const;

export type BusinessUnit = (typeof businessUnits)[number];

/** Portée d'activité de chaque BU (sert d'aide contextuelle dans l'interface). */
export const businessUnitScope: Record<BusinessUnit, string> = {
  "Infrastructure": "Excavation, daylighting, électricité télécom, TCP, travaux civils, FTTH, aérien et souterrain",
  "I&R": "Installation, réparation et travaux terrain télécommunications",
  "Structured Cabling": "Fibre, cuivre, Wi-Fi, DAS, AV, sécurité, centres de données",
  "Design": "Conception, dessin technique, ingénierie de réseaux, arpentage et relevés terrain",
  "Locate": "Localisation d'infrastructures, utility locating, vérification des services souterrains",
  "Warehouse": "Entrepôt, réception, inventaire, matériel",
};

/** Sous-divisions connues, à titre indicatif. */
export const businessUnitDivisions: Partial<Record<BusinessUnit, string[]>> = {
  "Infrastructure": ["Infrastructure QC", "Infrastructure ON", "Infrastructure West"],
  "Design": ["Design CAD", "Design Surveyors", "Design Canada", "Design USA"],
  "Locate": ["Promark Utility Services"],
  "Structured Cabling": ["Enterprise Connectivity"],
};

/** Niveau 2 — Régions. */
export const regions = ["QC", "ON", "West", "Atlantique", "USA"] as const;
export type Region = (typeof regions)[number];

/** Rattachement province → région. */
const provinceToRegion: Record<string, Region> = {
  QC: "QC",
  ON: "ON",
  AB: "West", BC: "West", SK: "West", MB: "West",
  NB: "Atlantique", NS: "Atlantique", PE: "Atlantique", NL: "Atlantique",
  US: "USA",
};

export function regionForProvince(province: string): Region {
  return provinceToRegion[province] ?? "QC";
}

/** Niveau 3 — Postes. */
export const positions = [
  "Monteur",
  "Technicien",
  "Localisateur",
  "Arpenteur",
  "Dessinateur CAD",
  "Contremaître",
  "Superviseur",
  "Gestionnaire",
  "Magasinier",
] as const;

export type Position = (typeof positions)[number];

/**
 * Les feuilles Excel (matrice avancée, profils de postes) utilisent des libellés
 * abrégés hérités. Cette table les rattache aux BU canoniques pour que les filtres
 * croisés restent cohérents entre la matrice et les dossiers employés.
 */
const buAliases: Record<string, BusinessUnit> = {
  "Infra": "Infrastructure",
  "Infrastructure": "Infrastructure",
  "IR": "I&R",
  "I&R": "I&R",
  "Câblage structuré": "Structured Cabling",
  "Structured Cabling": "Structured Cabling",
  "Opérations régionales": "Structured Cabling",
  "Enterprise Connectivity": "Structured Cabling",
  "Design": "Design",
  "Conception CAD": "Design",
  "Géomètres Design": "Design",
  "Localisation": "Locate",
  "Locate": "Locate",
  "Promark": "Locate",
  "Entrepôt": "Warehouse",
  "Warehouse": "Warehouse",
};

/** Normalise un libellé de BU vers sa forme canonique. Renvoie null si non reconnu. */
export function normalizeBusinessUnit(label: string): BusinessUnit | null {
  return buAliases[label.trim()] ?? null;
}

/** Vrai si le libellé (matrice) et la BU (employé) désignent la même unité. */
export function matchesBusinessUnit(label: string, bu: string): boolean {
  if (label === "Tous") return true;
  const a = normalizeBusinessUnit(label);
  const b = normalizeBusinessUnit(bu);
  return a !== null && a === b;
}
