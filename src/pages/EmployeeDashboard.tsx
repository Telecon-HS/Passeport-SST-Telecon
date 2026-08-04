import { useApp } from "@/lib/app-context";
import { employeeById } from "@/data/employees";
import { recordsForEmployee } from "@/data/trainingRecords";
import { trainingCatalog } from "@/data/trainingCatalog";
import { authorizationsForEmployee } from "@/data/authorizations";
import { psfceRecords } from "@/data/psfce";
import { onboardingCases } from "@/data/evidence";
import { ComplianceKpiCard } from "@/components/shared/ComplianceKpiCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TrainingModuleCard } from "@/components/shared/TrainingModuleCard";
import { AuthorizationCard } from "@/components/shared/AuthorizationCard";
import { OnboardingTimeline } from "@/components/shared/OnboardingTimeline";
import { trainingStateTone, psfceTone, psfceLabel } from "@/lib/status";
import { GraduationCap, ClipboardCheck, ShieldCheck, AlertTriangle, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmployeeDashboard() {
  const { focusEmployeeId, setScreen } = useApp();
  const employee = employeeById(focusEmployeeId ?? "EMP001")!;
  const records = recordsForEmployee(employee.id);
  const completed = records.filter((r) => r.state === "Complété").length;
  const inProgress = records.filter((r) => r.state === "En cours").length;
  const upcoming = records.filter((r) => r.state === "Expire bientôt" || r.state === "À faire");
  const authorizations = authorizationsForEmployee(employee.id);
  const myPsfce = psfceRecords.filter((p) => p.employeeId === employee.id);
  const onboarding = onboardingCases.find((o) => o.employeeId === employee.id);

  const nextModules = records
    .filter((r) => r.state === "À faire" || r.state === "Expire bientôt")
    .slice(0, 6)
    .map((r) => trainingCatalog.find((m) => m.id === r.moduleId))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">Bonjour, {employee.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-slate-500">Voici où en est votre conformité SST aujourd'hui.</p>
        </div>
        <Button className="bg-tc-navy hover:bg-tc-navy2" onClick={() => setScreen("passport")}>
          <CreditCard className="mr-2 h-4 w-4" /> Voir mon passeport complet
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ComplianceKpiCard label="Conformité globale" value={employee.compliance} suffix="%" icon={ShieldCheck} />
        <ComplianceKpiCard label="Formations complétées" value={completed} icon={GraduationCap} tone="teal" />
        <ComplianceKpiCard label="Formations en cours" value={inProgress} icon={ClipboardCheck} tone="navy" />
        <ComplianceKpiCard label="Échéances à traiter" value={upcoming.length} icon={AlertTriangle} tone={upcoming.length > 3 ? "red" : "orange"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-tc-navy">À compléter prochainement</h2>
              <button onClick={() => setScreen("trainingCenter")} className="flex items-center gap-1 text-xs font-semibold text-tc-teal hover:underline">
                Centre de formation <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {nextModules.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">Aucune formation en attente — excellent travail !</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {nextModules.map((m) => m && <TrainingModuleCard key={m.id} module={m} />)}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-display text-base font-bold text-tc-navy">Mes autorisations de travail</h2>
            <div className="space-y-2.5">
              {authorizations.map((a) => (
                <AuthorizationCard key={a.id} authorization={a} />
              ))}
              {authorizations.length === 0 && <p className="text-sm text-slate-400">Aucune autorisation enregistrée.</p>}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {myPsfce.length > 0 && (
            <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-display text-base font-bold text-tc-navy">Mon PSFCE</h2>
              <div className="space-y-3">
                {myPsfce.map((p) => (
                  <div key={p.id} className="rounded-xl border border-tc-border p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-tc-text">{p.competency}</span>
                      <StatusBadge label={psfceLabel(p.status)} tone={psfceTone(p.status)} className="text-[10px]" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Mentor : {p.mentor}</p>
                    <div className="mt-2 text-xs font-medium text-tc-teal">
                      {p.steps.filter((s) => s.done).length}/{p.steps.length} étapes complétées
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {onboarding && (
            <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-display text-base font-bold text-tc-navy">Mon parcours d'accueil</h2>
              <OnboardingTimeline onboardingCase={onboarding} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
