// Central mapping of business statuses to Telecon design-system colors.

export type StatusTone = "green" | "blue" | "gray" | "orange" | "red" | "teal";

export function toneClasses(tone: StatusTone) {
  switch (tone) {
    case "green":
      return "bg-tc-green/10 text-tc-green border-tc-green/25";
    case "blue":
      return "bg-tc-navy2/10 text-tc-navy2 border-tc-navy2/25";
    case "teal":
      return "bg-tc-teal/10 text-tc-teal border-tc-teal/25";
    case "orange":
      return "bg-tc-orange/10 text-tc-orange border-tc-orange/30";
    case "red":
      return "bg-tc-red/10 text-tc-red border-tc-red/25";
    case "gray":
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export function toneDot(tone: StatusTone) {
  switch (tone) {
    case "green": return "bg-tc-green";
    case "blue": return "bg-tc-navy2";
    case "teal": return "bg-tc-teal";
    case "orange": return "bg-tc-orange";
    case "red": return "bg-tc-red";
    default: return "bg-slate-400";
  }
}

export function globalStatusTone(status: string): StatusTone {
  switch (status) {
    case "Autorisé": return "green";
    case "Sous supervision": return "orange";
    case "Non autorisé": return "red";
    case "Expiré": return "red";
    default: return "gray";
  }
}

export function trainingStateTone(status: string): StatusTone {
  switch (status) {
    case "Complété": return "green";
    case "En cours": return "blue";
    case "À faire": return "gray";
    case "Expire bientôt": return "orange";
    case "Expiré": return "red";
    default: return "gray";
  }
}

export function authorizationTone(status: string): StatusTone {
  switch (status) {
    case "Authorized": return "green";
    case "Supervised": return "orange";
    case "Not authorized": return "red";
    case "Expired": return "red";
    default: return "gray";
  }
}

export function authorizationLabel(status: string): string {
  switch (status) {
    case "Authorized": return "Autorisé";
    case "Supervised": return "Sous supervision";
    case "Not authorized": return "Non autorisé";
    case "Expired": return "Expiré";
    default: return status;
  }
}

export function psfceTone(status: string): StatusTone {
  switch (status) {
    case "Completed": return "green";
    case "In progress": return "blue";
    case "Blocked": return "red";
    case "Not started": return "gray";
    default: return "gray";
  }
}

export function psfceLabel(status: string): string {
  switch (status) {
    case "Completed": return "Complété";
    case "In progress": return "En cours";
    case "Blocked": return "Bloqué";
    case "Not started": return "À débuter";
    default: return status;
  }
}

export function riskTone(risk: string): StatusTone {
  switch (risk) {
    case "Élevée": return "red";
    case "Moyenne": return "orange";
    case "Faible": return "gray";
    default: return "gray";
  }
}

export function moduleStatusTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (s.includes("good") || s.includes("ready")) return "green";
  if (s.includes("verif") || s.includes("update") || s.includes("not verified")) return "orange";
  if (s.includes("retired") || s.includes("draft")) return "red";
  return "gray";
}

export function complianceTone(pct: number): StatusTone {
  if (pct >= 85) return "green";
  if (pct >= 65) return "orange";
  return "red";
}
