import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { onboardingCases } from "@/data/evidence";
import { employeeById } from "@/data/employees";
import { OnboardingTimeline } from "@/components/shared/OnboardingTimeline";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ComplianceKpiCard } from "@/components/shared/ComplianceKpiCard";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Mail, UserPlus, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const caseTone: Record<string, "gray" | "blue" | "orange" | "green"> = {
  "Nouveau": "gray",
  "Profil créé": "blue",
  "Formation assignée": "blue",
  "En validation": "orange",
  "Complété": "green",
};

export function HRDashboard() {
  const t = useT();
  const { navigateToPassport } = useApp();
  const [selectedId, setSelectedId] = useState(onboardingCases[0]?.id);
  const selected = onboardingCases.find((c) => c.id === selectedId);
  const selectedEmployee = selected ? employeeById(selected.employeeId) : null;

  const inProgress = onboardingCases.filter((c) => c.status !== "Complété").length;
  const readyForDay1 = onboardingCases.filter((c) => {
    const emp = employeeById(c.employeeId);
    return emp?.mintzStatus === "Complété" && emp?.drivingRecordStatus === "Complété";
  }).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">{t("dash.hrTitle")}</h1>
          <p className="text-sm text-slate-500">{t("dash.hrSubtitle")}</p>
        </div>
        <Button className="bg-tc-navy hover:bg-tc-navy2">
          <UserPlus className="mr-2 h-4 w-4" /> {t("dash.newOnboarding")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ComplianceKpiCard label={t("dash.activeCases")} value={onboardingCases.length} icon={Mail} tone="navy" />
        <ComplianceKpiCard label={t("dash.inProgress")} value={inProgress} icon={Clock} tone="orange" />
        <ComplianceKpiCard label={t("dash.readyDay1")} value={readyForDay1} icon={CheckCircle2} tone="green" />
        <ComplianceKpiCard label={t("dash.completionRate")} value={Math.round(((onboardingCases.length - inProgress) / onboardingCases.length) * 100)} suffix="%" icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          {onboardingCases.map((c) => {
            const emp = employeeById(c.employeeId);
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  active ? "border-tc-teal bg-tc-teal/5 shadow-sm" : "border-tc-border bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tc-navy text-[11px] font-bold text-white">
                  {emp?.photoInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-tc-text">{emp?.name}</div>
                  <div className="truncate text-xs text-slate-500">{emp?.position} · reçu le {c.receivedDate}</div>
                </div>
                <StatusBadge label={c.status} tone={caseTone[c.status]} className="text-[10px]" dot={false} />
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {selected && selectedEmployee && (
            <div className="rounded-2xl border border-tc-border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-tc-navy">{selectedEmployee.name}</h2>
                  <p className="text-sm text-slate-500">{selectedEmployee.position} · {selectedEmployee.businessUnit} · {selectedEmployee.province}</p>
                </div>
                <button
                  onClick={() => navigateToPassport(selectedEmployee.id)}
                  className="rounded-full border border-tc-border px-3 py-1.5 text-xs font-semibold text-tc-navy2 hover:bg-slate-50"
                >
                  {t("dash.viewPassport")} →
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <PrereqPill label="Mintz" value={selectedEmployee.mintzStatus} />
                <PrereqPill label="Dossier conduite" value={selectedEmployee.drivingRecordStatus} />
                <PrereqPill label="Accès IT" value={selectedEmployee.itAccess ? "Complété" : "En attente"} />
                <PrereqPill label="Compte MS" value={selectedEmployee.microsoftAccount ? "Complété" : "En attente"} />
              </div>

              <div className="mt-6 border-t border-tc-border pt-6">
                <OnboardingTimeline onboardingCase={selected} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PrereqPill({ label, value }: { label: string; value: string }) {
  const tone = value === "Complété" ? "text-tc-green bg-tc-green/10" : value === "En cours" ? "text-tc-orange bg-tc-orange/10" : "text-tc-red bg-tc-red/10";
  return (
    <div className={cn("rounded-xl p-3 text-center", tone)}>
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  );
}
