import { useApp } from "@/lib/app-context";
import { authorizations } from "@/data/authorizations";
import { matrixRules } from "@/data/matrixRules";
import { PowerBIWidget } from "@/components/shared/PowerBIWidget";
import { ComplianceKpiCard } from "@/components/shared/ComplianceKpiCard";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { MonitorSmartphone, Gauge, CalendarClock, Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const trend = [
  { month: "Mars", value: 71 },
  { month: "Avril", value: 74 },
  { month: "Mai", value: 76 },
  { month: "Juin", value: 79 },
  { month: "Juil.", value: 78 },
  { month: "Août", value: 81 },
];

export function PowerBIView() {
  const { visibleEmployees: employees } = useApp();
  const [region, setRegion] = useState("Tous");
  const regionList = Array.from(new Set(employees.map((e) => e.region))).sort();
  const scoped = region === "Tous" ? employees : employees.filter((e) => e.region === region);
  const avgCompliance = Math.round(scoped.reduce((s, e) => s + e.compliance, 0) / (scoped.length || 1));

  const byBU = Array.from(new Set(scoped.map((e) => e.businessUnit))).map((c) => ({
    name: c,
    value: Math.round(
      scoped.filter((e) => e.businessUnit === c).reduce((s, e) => s + e.compliance, 0) /
        scoped.filter((e) => e.businessUnit === c).length
    ),
  }));

  const expiring = authorizations.filter((a) => a.validUntil && a.validUntil < "2026-11-01" && a.validUntil >= "2026-08-01");

  const highRiskCount = matrixRules.filter((r) => r.psfceRequired !== "Non").length;
  const corControlled = matrixRules.filter((r) => r.psfceRequired !== "Non").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tc-orange/10 text-tc-orange">
            <MonitorSmartphone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-tc-navy">Vue Power BI — Conformité SST</h1>
            <p className="text-sm text-slate-500">Simulation de tableau de bord connecté à SharePoint / Forms / eCompliance.</p>
          </div>
        </div>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="h-9 w-44 border-tc-border text-sm"><SelectValue placeholder="Région" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Toutes régions</SelectItem>
            {regionList.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ComplianceKpiCard label="Conformité (filtre actif)" value={avgCompliance} suffix="%" icon={Gauge} trend="up" trendLabel="+3 pts / mois" />
        <ComplianceKpiCard label="Autorisations expirant (60j)" value={expiring.length} icon={CalendarClock} tone="orange" />
        <ComplianceKpiCard label="Règles avec PSFCE" value={highRiskCount} icon={Building2} tone="red" />
        <ComplianceKpiCard label="Contrôles COR actifs" value={corControlled} icon={Gauge} tone="teal" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PowerBIWidget title="Tendance de conformité" subtitle="6 derniers mois" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D9E2EC", fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#008C82" strokeWidth={2.5} dot={{ r: 3, fill: "#008C82" }} />
            </LineChart>
          </ResponsiveContainer>
        </PowerBIWidget>

        <PowerBIWidget title="Objectif de conformité" subtitle="Cible : 90 %">
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "Conformité", value: avgCompliance, fill: "#008C82" }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={12} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="-mt-28 text-center">
            <div className="font-display text-3xl font-bold text-tc-navy">{avgCompliance}%</div>
            <div className="text-xs text-slate-400">vs 90% cible</div>
          </div>
        </PowerBIWidget>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PowerBIWidget title="Conformité par Business Unit" subtitle="Moyenne par BU">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byBU} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#F4F7FA" }} contentStyle={{ borderRadius: 12, border: "1px solid #D9E2EC", fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </PowerBIWidget>

        <PowerBIWidget title="Échéances à venir" subtitle="Autorisations expirant dans les 60 jours">
          <div className="max-h-[200px] space-y-2 overflow-y-auto scrollbar-thin pr-1">
            {expiring.map((a) => {
              const emp = employees.find((e) => e.id === a.employeeId);
              return (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  <div>
                    <div className="font-medium text-tc-text">{emp?.name}</div>
                    <div className="text-slate-400">{a.activity}</div>
                  </div>
                  <span className="font-semibold text-tc-orange">{a.validUntil}</span>
                </div>
              );
            })}
            {expiring.length === 0 && <p className="text-center text-sm text-slate-400 py-6">Aucune échéance dans cette fenêtre.</p>}
          </div>
        </PowerBIWidget>
      </div>
    </div>
  );
}
