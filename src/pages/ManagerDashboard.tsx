import { useApp } from "@/lib/app-context";
import { useDataStore } from "@/lib/data-store";
import { matrixRules } from "@/data/matrixRules";
import { ComplianceKpiCard } from "@/components/shared/ComplianceKpiCard";
import { PowerBIWidget } from "@/components/shared/PowerBIWidget";
import { EmployeeTable } from "@/components/shared/EmployeeTable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { ShieldCheck, Users, AlertTriangle, TrendingUp } from "lucide-react";

const COLORS = { green: "#16A34A", orange: "#F59E0B", red: "#DC2626", navy: "#123E6D" };

function groupAvg<T>(items: T[], keyFn: (t: T) => string, valFn: (t: T) => number) {
  const map = new Map<string, { sum: number; count: number }>();
  items.forEach((it) => {
    const k = keyFn(it);
    const cur = map.get(k) ?? { sum: 0, count: 0 };
    cur.sum += valFn(it);
    cur.count += 1;
    map.set(k, cur);
  });
  return Array.from(map.entries()).map(([name, v]) => ({ name, value: Math.round(v.sum / v.count) }));
}

export function ManagerDashboard() {
  const { visibleEmployees: employees } = useApp();
  const { authorizations } = useDataStore();
  const avgCompliance = Math.round(employees.reduce((s, e) => s + e.compliance, 0) / employees.length);
  const authorized = employees.filter((e) => e.globalStatus === "Autorisé").length;

  const byBU = groupAvg(employees, (e) => e.businessUnit, (e) => e.compliance).sort((a, b) => b.value - a.value);
  const byProvince = groupAvg(employees, (e) => e.province, (e) => e.compliance).sort((a, b) => b.value - a.value);

  const statusCounts = ["Autorisé", "Sous supervision", "Non autorisé", "Expiré"].map((s) => ({
    name: s,
    value: employees.filter((e) => e.globalStatus === s).length,
  })).filter((d) => d.value > 0);
  const statusColor: Record<string, string> = {
    "Autorisé": COLORS.green, "Sous supervision": COLORS.orange, "Non autorisé": COLORS.red, "Expiré": "#991B1B",
  };

  const atRisk = employees.filter((e) => e.compliance < 65).sort((a, b) => a.compliance - b.compliance);
  const highRiskRules = matrixRules.filter((r) => r.riskPriority === "Élevée").length;
  const notAuthCritical = authorizations.filter((a) => a.status === "Not authorized").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-tc-navy">Tableau de bord Gestionnaire</h1>
        <p className="text-sm text-slate-500">Conformité, risques et échéances en temps réel sur l'ensemble des BU.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ComplianceKpiCard label="Conformité globale" value={avgCompliance} suffix="%" icon={ShieldCheck} />
        <ComplianceKpiCard label="Employés autorisés" value={authorized} icon={Users} tone="green" />
        <ComplianceKpiCard label="Non autorisés (tâche critique)" value={notAuthCritical} icon={AlertTriangle} tone="red" />
        <ComplianceKpiCard label="Règles priorité élevée" value={highRiskRules} icon={TrendingUp} tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PowerBIWidget title="Conformité par unité d'affaires" subtitle="Moyenne pondérée par employé" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byBU} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip cursor={{ fill: "#F4F7FA" }} contentStyle={{ borderRadius: 12, border: "1px solid #D9E2EC", fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#008C82" />
            </BarChart>
          </ResponsiveContainer>
        </PowerBIWidget>

        <PowerBIWidget title="Répartition des statuts" subtitle="Effectif total">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {statusCounts.map((d) => (
                  <Cell key={d.name} fill={statusColor[d.name]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #D9E2EC", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </PowerBIWidget>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PowerBIWidget title="Conformité par province" subtitle="Effectif actif">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byProvince} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EEF2F6" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip cursor={{ fill: "#F4F7FA" }} contentStyle={{ borderRadius: 12, border: "1px solid #D9E2EC", fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#123E6D" />
            </BarChart>
          </ResponsiveContainer>
        </PowerBIWidget>

        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-tc-navy">Employés à risque (conformité &lt; 65 %)</h2>
          </div>
          <EmployeeTable employees={atRisk} />
        </div>
      </div>
    </div>
  );
}
