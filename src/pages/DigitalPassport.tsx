import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { employees, employeeById } from "@/data/employees";
import { recordsForEmployee } from "@/data/trainingRecords";
import { trainingCatalog } from "@/data/trainingCatalog";
import { authorizationsForEmployee } from "@/data/authorizations";
import { psfceRecords } from "@/data/psfce";
import { evidenceForEmployee } from "@/data/evidence";
import { PassportCard } from "@/components/shared/PassportCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AuthorizationCard } from "@/components/shared/AuthorizationCard";
import { EvidenceDrawer } from "@/components/shared/EvidenceDrawer";
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
  const { focusEmployeeId, setFocusEmployeeId, role } = useApp();
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const employee = employeeById(focusEmployeeId ?? "EMP001") ?? employees[0];
  const records = recordsForEmployee(employee.id);
  const authorizations = authorizationsForEmployee(employee.id);
  const psfce = psfceRecords.filter((p) => p.employeeId === employee.id);
  const evidence = evidenceForEmployee(employee.id);
  const canSwitch = role !== "Employé";

  const groups: { label: string; filter: (id: string) => boolean }[] = [
    { label: "Orientation corporative", filter: (id) => id.startsWith("ORI") || id.startsWith("SIM") || id.startsWith("WHMIS") || id.startsWith("DRV") },
    { label: "TQT / STKY", filter: (id) => ["TQT-FR", "SIL-FR", "EXC-FR", "DAY-EN", "LOC-EN", "FLUKE-EN", "ELEC-FR", "RESP-FR", "LEAD-FR"].includes(id) },
    { label: "Formation BU / métier", filter: (id) => ["TOOLS-FR", "PUB-FR", "TCP-ON"].includes(id) },
    { label: "Autre / réglementaire", filter: (id) => ["NALOX-ON", "HAZCOM-US", "FIRE-EN", "ENERGY-FR", "PREJOB-FR", "IMP-FR", "URG-FR", "DIL-FR", "EVID-FR"].includes(id) },
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
              {employees.map((e) => (
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
                          <div key={r.moduleId} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
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
