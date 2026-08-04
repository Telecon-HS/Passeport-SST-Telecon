import { useApp } from "@/lib/app-context";
import { employees } from "@/data/employees";
import { authorizations } from "@/data/authorizations";
import { psfceRecords } from "@/data/psfce";
import { ComplianceKpiCard } from "@/components/shared/ComplianceKpiCard";
import { EmployeeTable } from "@/components/shared/EmployeeTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { psfceTone, psfceLabel } from "@/lib/status";
import { Users, ShieldAlert, ClipboardList, TrendingUp, ArrowRight, AlertOctagon } from "lucide-react";

export function SupervisorDashboard() {
  const { persona, setScreen, navigateToPassport } = useApp();
  const team = employees.filter((e) => e.manager === persona.displayName);
  const avgCompliance = team.length ? Math.round(team.reduce((s, e) => s + e.compliance, 0) / team.length) : 0;
  const notAuthorized = team.filter((e) => e.globalStatus === "Non autorisé").length;
  const teamPsfce = psfceRecords.filter((p) => team.some((e) => e.id === p.employeeId));
  const activePsfce = teamPsfce.filter((p) => p.status === "In progress" || p.status === "Blocked");

  const criticalGaps = team.flatMap((e) =>
    authorizations
      .filter((a) => a.employeeId === e.id && (a.status === "Not authorized" || a.status === "Expired"))
      .map((a) => ({ employee: e, auth: a }))
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-tc-navy">Mon équipe</h1>
        <p className="text-sm text-slate-500">Vue d'ensemble de la conformité et des écarts à traiter — {persona.displayName}.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ComplianceKpiCard label="Membres de l'équipe" value={team.length} icon={Users} tone="navy" />
        <ComplianceKpiCard label="Conformité moyenne" value={avgCompliance} suffix="%" icon={TrendingUp} />
        <ComplianceKpiCard label="Non autorisés" value={notAuthorized} icon={ShieldAlert} tone={notAuthorized > 0 ? "red" : "green"} />
        <ComplianceKpiCard label="PSFCE actifs" value={activePsfce.length} icon={ClipboardList} tone="teal" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-tc-navy">Membres de l'équipe</h2>
          </div>
          <EmployeeTable employees={team} />
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-tc-red" />
              <h2 className="font-display text-sm font-bold text-tc-navy">Écarts critiques</h2>
            </div>
            {criticalGaps.length === 0 && <p className="text-sm text-slate-400">Aucun écart critique détecté.</p>}
            <div className="space-y-2">
              {criticalGaps.slice(0, 6).map(({ employee, auth }, i) => (
                <button
                  key={i}
                  onClick={() => navigateToPassport(employee.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-tc-red/20 bg-tc-red/[0.04] px-3 py-2 text-left hover:bg-tc-red/[0.08]"
                >
                  <div>
                    <div className="text-sm font-medium text-tc-text">{employee.name}</div>
                    <div className="text-xs text-slate-500">{auth.activity}</div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-tc-red" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-tc-navy">PSFCE de l'équipe</h2>
              <button onClick={() => setScreen("psfce")} className="flex items-center gap-1 text-xs font-semibold text-tc-teal hover:underline">
                Gérer <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {teamPsfce.map((p) => {
                const emp = team.find((e) => e.id === p.employeeId);
                return (
                  <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg border border-tc-border px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-tc-text">{emp?.name}</div>
                      <div className="truncate text-xs text-slate-500">{p.competency}</div>
                    </div>
                    <StatusBadge label={psfceLabel(p.status)} tone={psfceTone(p.status)} className="text-[10px]" />
                  </div>
                );
              })}
              {teamPsfce.length === 0 && <p className="text-sm text-slate-400">Aucun PSFCE pour l'équipe.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
