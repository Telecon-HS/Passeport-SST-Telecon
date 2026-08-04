import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { employeeById } from "@/data/employees";
import { recordsForEmployee } from "@/data/trainingRecords";
import { trainingCatalog } from "@/data/trainingCatalog";
import { useDataStore } from "@/lib/data-store";
import { usesVisitorProfile, psfceRequirementFor, fieldCompetenciesFor, targetAuthorizationsFor } from "@/lib/matrix-engine";
import { evidenceForEmployee } from "@/data/evidence";
import { PassportCard } from "@/components/shared/PassportCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AuthorizationCard } from "@/components/shared/AuthorizationCard";
import { EvidenceDrawer } from "@/components/shared/EvidenceDrawer";
import { ModuleResources } from "@/components/shared/ModuleResources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trainingStateTone, psfceTone, psfceLabel } from "@/lib/status";
import { Button } from "@/components/ui/button";
import { FolderCheck, CheckCircle2, Circle, Clock, AlertTriangle, XCircle, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

const stateIcon: Record<string, any> = {
  "Complété": CheckCircle2,
  "En cours": Clock,
  "À faire": Circle,
  "Expire bientôt": AlertTriangle,
  "Expiré": XCircle,
};

export function DigitalPassport() {
  const { focusEmployeeId, setFocusEmployeeId, role, visibleEmployees, canViewEmployee } = useApp();
  const { authorizations: allAuthorizations, psfce: allPsfce } = useDataStore();
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const resolvedId = focusEmployeeId && canViewEmployee(focusEmployeeId) ? focusEmployeeId : visibleEmployees[0]?.id;
  const employee = (resolvedId ? employeeById(resolvedId) : undefined) ?? visibleEmployees[0];
  const records = recordsForEmployee(employee.id);
  const authorizations = allAuthorizations.filter((a) => a.employeeId === employee.id);
  const psfce = allPsfce.filter((p) => p.employeeId === employee.id);
  const evidence = evidenceForEmployee(employee.id);
  const canSwitch = role !== "Employé" && visibleEmployees.length > 1;

  const categoryOf = (id: string) => trainingCatalog.find((m) => m.id === id)?.category ?? "Autre";
  const groups: { label: string; filter: (id: string) => boolean }[] = [
    { label: "Orientation corporative", filter: (id) => categoryOf(id) === "Orientation" },
    { label: "TQT / STKY", filter: (id) => categoryOf(id) === "TQT" },
    { label: "Orientation métier", filter: (id) => ["Orientation métier", "Technique"].includes(categoryOf(id)) },
    { label: "Urgence et provincial", filter: (id) => ["Urgence", "Provincial"].includes(categoryOf(id)) },
    { label: "Développement superviseur", filter: (id) => categoryOf(id) === "Supervisor Development" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      {canSwitch && (
        <div className="flex items-center gap-2 rounded-xl border border-tc-border bg-white p-2.5 shadow-sm">
          <Users2 className="ml-1 h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Consulter le passeport de :</span>
          <Select value={employee.id} onValueChange={setFocusEmployeeId}>
            <SelectTrigger className="h-8 w-64 border-tc-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visibleEmployees.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name} — {e.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <PassportCard employee={employee} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="formations">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="formations">Formations</TabsTrigger>
              <TabsTrigger value="psfce">PSFCE</TabsTrigger>
              <TabsTrigger value="autorisations">Autorisations</TabsTrigger>
            </TabsList>

            <TabsContent value="formations" className="mt-4 space-y-5">
              {groups.map((group) => {
                const groupRecords = records.filter((r) => group.filter(r.moduleId));
                if (groupRecords.length === 0) return null;
                return (
                  <div key={group.label} className="rounded-2xl border border-tc-border bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">{group.label}</h3>
                    <div className="space-y-1">
                      {groupRecords.map((r) => {
                        const module = trainingCatalog.find((m) => m.id === r.moduleId);
                        if (!module) return null;
                        const Icon = stateIcon[r.state];
                        const tone = trainingStateTone(r.state);
                        return (
                          <div key={r.moduleId} className="rounded-lg px-2 py-2 hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                            <Icon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                tone === "green" && "text-tc-green",
                                tone === "blue" && "text-tc-navy2",
                                tone === "orange" && "text-tc-orange",
                                tone === "red" && "text-tc-red",
                                tone === "gray" && "text-slate-300"
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-tc-text">{module.title}</div>
                              {r.quizScore && <div className="text-xs text-slate-400">Quiz : {r.quizScore}%</div>}
                            </div>
                            <StatusBadge label={r.state} tone={tone} className="text-[10px]" />
                            </div>
                            {module.resources && module.resources.length > 0 && (
                              <div className="ml-7 mt-1.5">
                                <ModuleResources resources={module.resources} compact />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="psfce" className="mt-4 space-y-4">
              {psfce.length === 0 && (
                <div className="rounded-2xl border border-dashed border-tc-border py-12 text-center text-sm text-slate-400">
                  Aucun PSFCE actif pour cet employé.
                </div>
              )}
              {psfce.map((p) => (
                <div key={p.id} className="rounded-2xl border border-tc-border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-tc-text">{p.competency}</h3>
                    <StatusBadge label={psfceLabel(p.status)} tone={psfceTone(p.status)} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Mentor : {p.mentor} · Niveau : {p.level}</p>
                  <div className="mt-3 space-y-1.5">
                    {p.steps.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {s.done ? <CheckCircle2 className="h-3.5 w-3.5 text-tc-green" /> : <Circle className="h-3.5 w-3.5 text-slate-300" />}
                        <span className={s.done ? "text-tc-text" : "text-slate-400"}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="autorisations" className="mt-4 space-y-2.5">
              {authorizations.map((a) => (
                <AuthorizationCard key={a.id} authorization={a} />
              ))}
              {authorizations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-tc-border py-12 text-center text-sm text-slate-400">
                  Aucune autorisation enregistrée.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-sm font-bold text-tc-navy">Profil requis (matrice)</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {employee.businessUnit} · {employee.position}
            </p>
            {usesVisitorProfile(employee) && (
              <div className="mt-2 rounded-lg border border-tc-orange/25 bg-tc-orange/[0.06] px-2.5 py-2 text-[11px] leading-relaxed text-tc-orange">
                <span className="font-semibold">Profil de visiteur de base appliqué.</span> Ce poste
                n'est pas encore couvert par une règle de matrice : accès accompagné uniquement,
                aucune tâche critique autorisée. À compléter par le PASS SST.
              </div>
            )}
                <div className="mt-3 flex items-center justify-between border-b border-tc-border/60 pb-2 text-xs">
                  <span className="text-slate-500">PSFCE requis</span>
                  <span className="font-medium text-tc-text">{psfceRequirementFor(employee)}</span>
                </div>
                <div className="mt-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Autorisations visées
                  </div>
                  {targetAuthorizationsFor(employee).map((a, i) => (
                    <div key={i} className="mt-1 text-xs text-tc-text">
                      {a.authorization}
                      <span className="text-slate-400"> — {a.owner}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Compétences terrain à évaluer
                  </div>
                  <ul className="mt-1 space-y-1">
                    {fieldCompetenciesFor(employee).map((c, i) => (
                      <li key={i} className="flex gap-1.5 text-xs text-slate-600">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-tc-teal" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
          </section>

          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-display text-sm font-bold text-tc-navy">Prérequis RH</h2>
            <div className="space-y-2 text-sm">
              <RhRow label="Vérification Mintz" value={employee.mintzStatus} />
              <RhRow label="Dossier de conduite" value={employee.drivingRecordStatus} />
              <RhRow label="Accès informatique" value={employee.itAccess ? "Complété" : "En attente"} />
              <RhRow label="Compte Microsoft" value={employee.microsoftAccount ? "Complété" : "En attente"} />
            </div>
          </section>

          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-tc-navy">Preuves disponibles</h2>
              <span className="text-xs font-semibold text-slate-400">{evidence.length}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Preuves exportables pour un audit COR.</p>
            <Button variant="outline" className="mt-3 w-full border-tc-border text-sm" onClick={() => setEvidenceOpen(true)}>
              <FolderCheck className="mr-2 h-4 w-4" /> Ouvrir la bibliothèque
            </Button>
          </section>
        </div>
      </div>

      <EvidenceDrawer open={evidenceOpen} onOpenChange={setEvidenceOpen} employeeName={employee.name} evidence={evidence} />
    </div>
  );
}

function RhRow({ label, value }: { label: string; value: string }) {
  const tone = value === "Complété" ? "text-tc-green" : value === "En cours" ? "text-tc-orange" : "text-tc-red";
  return (
    <div className="flex items-center justify-between border-b border-tc-border/60 py-1.5 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className={cn("font-medium", tone)}>{value}</span>
    </div>
  );
}
