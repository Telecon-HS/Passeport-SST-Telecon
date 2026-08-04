import type { Employee, MatrixRule, TrainingModule } from "@/types";
import { matrixRules } from "@/data/matrixRules";
import { trainingCatalog, moduleById } from "@/data/trainingCatalog";

/** Une règle s'applique-t-elle à une région donnée ? */
export function ruleCoversRegion(rule: MatrixRule, region: string): boolean {
  if (rule.regions === "Tous") return true;
  return rule.regions.split("/").map((r) => r.trim()).includes(region);
}

/** Règles de la matrice applicables à un employé (BU + poste + région). */
export function rulesForEmployee(employee: Employee): MatrixRule[] {
  return matrixRules.filter(
    (r) =>
      r.bu === employee.businessUnit &&
      r.position === employee.position &&
      ruleCoversRegion(r, employee.region)
  );
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
  if (rules.some((r) => r.psfceRequired.startsWith("Selon"))) {
    return rules.find((r) => r.psfceRequired.startsWith("Selon"))!.psfceRequired;
  }
  return rules.length ? "Non" : "À déterminer";
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
