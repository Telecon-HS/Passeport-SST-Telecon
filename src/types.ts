export type Role =
  | "Employé"
  | "Superviseur"
  | "Gestionnaire"
  | "PASS SST"
  | "HSBP"
  | "Gestionnaire programme SST"
  | "RH";

export type GlobalStatus = "Autorisé" | "Sous supervision" | "Non autorisé" | "Expiré";

export type ModuleCategory =
  | "Orientation"
  | "BU"
  | "TQT"
  | "Client"
  | "Supervisor"
  | "External";

export type DeliveryMode =
  | "Video"
  | "Presentation"
  | "External"
  | "Stream"
  | "YouTube"
  | "PowerPoint";

export type ModuleStatus = "Ready" | "Needs update" | "Draft" | "Retired" | "Good to use";

export interface Employee {
  id: string;
  name: string;
  employeeNumber: string;
  position: string;
  department: string;
  businessUnit: string;
  division?: string;
  region: string;
  province: string;
  client?: string;
  manager: string;
  startDate: string;
  globalStatus: GlobalStatus;
  compliance: number; // 0-100
  photoInitials: string;
  jobFamily: string;
  mintzStatus: "Complété" | "En cours" | "En attente";
  drivingRecordStatus: "Complété" | "En cours" | "En attente";
  itAccess: boolean;
  microsoftAccount: boolean;
  onboardingSent: boolean;
}

export type ResourceKind = "video" | "quiz" | "presentation" | "fichier";

export interface TrainingResource {
  kind: ResourceKind;
  language: "FR" | "EN";
  label: string;
  /** URL externe. Absente si la ressource est un fichier interne non publié. */
  url?: string;
  /** Nom du fichier interne, lorsqu'aucune URL n'est disponible. */
  fileName?: string;
  /** Réserve connue sur la ressource (ex. traduction à vérifier). */
  caveat?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: string;
  language: "FR" | "EN" | "Bilingual";
  businessUnits: string[];
  tqt: string[];
  client?: string;
  delivery: string;
  requiresQuiz: boolean;
  psfceRequirement: string;
  requiresFieldValidation: boolean;
  status: string;
  resources?: TrainingResource[];
}

export interface EmployeeTrainingRecord {
  employeeId: string;
  moduleId: string;
  state: "Complété" | "En cours" | "À faire" | "Expire bientôt" | "Expiré";
  quizScore?: number;
  completedDate?: string;
  expiryDate?: string;
}

export interface Authorization {
  id: string;
  employeeId: string;
  activity: string;
  status: "Authorized" | "Supervised" | "Not authorized" | "Expired";
  validatedBy: string | null;
  validUntil: string | null;
  linkedTqt: string;
}

export interface PSFCE {
  id: string;
  employeeId: string;
  competency: string;
  mentor: string;
  status: "Not started" | "In progress" | "Completed" | "Blocked";
  level: "Beginner" | "Intermediate" | "Competent";
  observations: string[];
  steps: { label: string; done: boolean }[];
}

export interface Evidence {
  id: string;
  employeeId: string;
  type: "Quiz" | "Certificate" | "Observation" | "Signature" | "File";
  linkedTo: string;
  label: string;
  date: string;
  auditReady: boolean;
}

export interface MatrixRule {
  id: string;
  status: string;
  bu: string;
  regions: string;
  position: string;
  positionLevel: string;
  client: string;
  projectType: string;
  tqt: string;
  requiredModules: string[];
  quizEvidence: string;
  psfceRequired: string;
  fieldCompetencies: string;
  targetAuthorization: string;
  defaultAuthorizationStatus: string;
  validationOwner: string;
  bpmn: string;
  corControl: string;
  source: string;
}

export interface JobProfile {
  id: string;
  jobFamily: string;
  position: string;
  defaultBU: string;
  typicalTasks: string;
  dominantTqt: string;
  minimalFormations: string[];
  psfceRequired: string;
  mentorRequired: string;
  autonomyTarget: string;
}

export interface OnboardingCase {
  id: string;
  employeeId: string;
  receivedDate: string;
  status: "Nouveau" | "Profil créé" | "Formation assignée" | "En validation" | "Complété";
  steps: { label: string; done: boolean; date?: string }[];
}

/** Parcours de formation composé par un partenaire d'affaires SST. */
export interface TrainingPath {
  id: string;
  name: string;
  businessUnit: string;
  position: string;
  client: string;
  projectType: string;
  region: string;
  moduleIds: string[];
  note: string;
  createdBy: string;
  createdAt: string;
}
