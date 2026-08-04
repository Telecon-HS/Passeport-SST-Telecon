import type { Employee, MatrixRule, TrainingModule } from "@/types";
import { matrixRules } from "@/data/matrixRules";
import { trainingCatalog, moduleById } from "@/data/trainingCatalog";

/** Une règle s'applique-t-elle à une région donnée ? */
export function ruleCoversRegion(rule: MatrixRule, region: string): boolean {
  if (rule.regions === "Tous") return true;
  return rule.regions.split("/").map((r) => r.trim()).includes(region);
}

/** Identifiant du profil de repli appliqué aux postes non encore couverts. */
export const VISITOR_RULE_ID = "R-000";

export const visitorRule = matrixRules.find((r) => r.id === VISITOR_RULE_ID)!;

/** Règles explicitement définies pour ce poste (sans repli). */
export function explicitRulesForEmployee(employee: Employee): MatrixRule[] {
  return matrixRules.filter(
    (r) =>
      r.id !== VISITOR_RULE_ID &&
      r.bu === employee.businessUnit &&
      r.position === employee.position &&
      ruleCoversRegion(r, employee.region)
  );
}

/**
 * Règles applicables à un employé. Si aucun poste ne correspond encore à la matrice,
 * le profil de visiteur de base s'applique : orientation minimale, accès accompagné,
 * aucune tâche critique autorisée.
 */
export function rulesForEmployee(employee: Employee): MatrixRule[] {
  const explicit = explicitRulesForEmployee(employee);
  return explicit.length > 0 ? explicit : [visitorRule];
}

/** Vrai si l'employé est couvert par le profil de repli plutôt qu'une règle de poste. */
export function usesVisitorProfile(employee: Employee): boolean {
  return explicitRulesForEmployee(employee).length === 0;
}

/**
 * Profil de formation requis : union des modules de toutes les règles applicables,
 * plus le tronc commun corporatif qui s'applique à tout le monde.
 */
export function requiredModulesFor(employee: Employee): TrainingModule[] {
  const ids = new Set<string>();
  rulesForEmployee(employee).forEach((r) => r.requiredModules.forEach((m) => ids.add(m)));

  // Tronc commun : orientation corporative pour tous les dossiers.
  ["ORI-001", "SRI-001"].forEach((m) => ids.add(m));

  return Array.from(ids)
    .map((id) => moduleById(id))
    .filter((m): m is TrainingModule => Boolean(m));
}

/** Autorisations visées par le poste, telles que définies dans la matrice. */
export function targetAuthorizationsFor(employee: Employee): {
  authorization: string;
  defaultStatus: string;
  owner: string;
}[] {
  return rulesForEmployee(employee).map((r) => ({
    authorization: r.targetAuthorization,
    defaultStatus: r.defaultAuthorizationStatus,
    owner: r.validationOwner,
  }));
}

/** Le poste exige-t-il un PSFCE ? */
export function psfceRequirementFor(employee: Employee): string {
  const rules = rulesForEmployee(employee);
  if (rules.some((r) => r.psfceRequired === "Oui")) return "Oui";
  const conditional = rules.find((r) => r.psfceRequired.startsWith("Selon"));
  return conditional ? conditional.psfceRequired : "Non";
}

/** Compétences terrain à évaluer pour le poste. */
export function fieldCompetenciesFor(employee: Employee): string[] {
  return rulesForEmployee(employee)
    .flatMap((r) => r.fieldCompetencies.split(";"))
    .map((c) => c.trim())
    .filter(Boolean);
}

/** Postes distincts présents dans la matrice, groupés par BU. */
export function positionsByBusinessUnit(): Record<string, string[]> {
  const map: Record<string, Set<string>> = {};
  matrixRules.forEach((r) => {
    map[r.bu] = map[r.bu] ?? new Set();
    map[r.bu].add(r.position);
  });
  return Object.fromEntries(
    Object.entries(map).map(([bu, set]) => [bu, Array.from(set)])
  );
}

export { trainingCatalog };
