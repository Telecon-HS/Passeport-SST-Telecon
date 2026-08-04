import { useApp } from "@/lib/app-context";
import { matrixRules } from "@/data/matrixRules";
import { trainingCatalog } from "@/data/trainingCatalog";
import { employees } from "@/data/employees";
import { ComplianceKpiCard } from "@/components/shared/ComplianceKpiCard";
import { PowerBIWidget } from "@/components/shared/PowerBIWidget";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { moduleStatusTone, riskTone } from "@/lib/status";
import { ClipboardList, ShieldAlert, Grid3x3, FileWarning, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function PassSSTDashboard() {
  const { setScreen } = useApp();
  const totalRules = matrixRules.length;
  const toValidate = matrixRules.filter((r) => r.status === "À valider").length;
  const highPriority = matrixRules.filter((r) => r.riskPriority === "Élevée").length;
  const nonGenericTqt = matrixRules.filter((r) => r.tqt !== "Tous").length;

  const modulesNeedingWork = trainingCatalog.filter((m) => moduleStatusTone(m.status) !== "green");
  const clientSpecific = matrixRules.filter((r) => r.client !== "Tous");

  const byRisk = ["Élevée", "Moyenne", "Faible"].map((r) => ({
    name: r,
    value: matrixRules.filter((m) => m.riskPriority === r).length,
  }));
  const riskColor: Record<string, string> = { "Élevée": "#DC2626", "Moyenne": "#F59E0B", "Faible": "#94A3B8" };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-tc-navy">Tableau de bord PASS SST</h1>
        <p className="text-sm text-slate-500">Administration de la matrice, des TQT, des formations et de la préparation COR.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ComplianceKpiCard label="Règles actives" value={totalRules} icon={Grid3x3} tone="navy" />
        <ComplianceKpiCard label="Règles à valider" value={toValidate} icon={ClipboardList} tone="orange" />
        <ComplianceKpiCard label="Priorité élevée" value={highPriority} icon={ShieldAlert} tone="red" />
        <ComplianceKpiCard label="Formations à corriger" value={modulesNeedingWork.length} icon={FileWarning} tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PowerBIWidget title="Règles par priorité de risque" subtitle="Matrice avancée — 45 règles">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byRisk} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#F4F7FA" }} contentStyle={{ borderRadius: 12, border: "1px solid #D9E2EC", fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byRisk.map((d) => <Cell key={d.name} fill={riskColor[d.name]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <button onClick={() => setScreen("matrix")} className="mt-2 flex items-center gap-1 text-xs font-semibold text-tc-teal hover:underline">
            Ouvrir la matrice complète <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </PowerBIWidget>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-tc-navy">Formations à corriger avant diffusion</h2>
            <button onClick={() => setScreen("trainingCenter")} className="flex items-center gap-1 text-xs font-semibold text-tc-teal hover:underline">
              Centre de formation <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="max-h-[280px] space-y-2 overflow-y-auto scrollbar-thin pr-1">
            {modulesNeedingWork.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-tc-border bg-white p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-tc-text">{m.title}</div>
                  <div className="text-xs text-slate-400">{m.id} · {m.category}</div>
                </div>
                <StatusBadge label={m.status} tone={moduleStatusTone(m.status)} className="shrink-0 text-[10px]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-tc-navy">Contextualisation client</h2>
          <span className="text-xs text-slate-400">{clientSpecific.length} règles avec exigence client spécifique</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {clientSpecific.map((r) => (
            <div key={r.id} className="rounded-xl border border-tc-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-tc-navy2">{r.id}</span>
                <StatusBadge label={r.riskPriority} tone={riskTone(r.riskPriority)} className="text-[10px]" />
              </div>
              <div className="mt-1 text-sm font-medium text-tc-text">{r.client}</div>
              <div className="text-xs text-slate-500">{r.formationTitle}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
