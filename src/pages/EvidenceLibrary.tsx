import { useMemo, useState } from "react";
import { evidenceLibrary } from "@/data/evidence";
import { employeeById, employees } from "@/data/employees";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FolderCheck, FileCheck2, Award, Eye, Signature, FileText, Download } from "lucide-react";
import { ComplianceKpiCard } from "@/components/shared/ComplianceKpiCard";

const typeIcon: Record<string, any> = { Quiz: FileCheck2, Certificate: Award, Observation: Eye, Signature: Signature, File: FileText };
const typeLabel: Record<string, string> = { Quiz: "Quiz", Certificate: "Certificat", Observation: "Observation", Signature: "Signature", File: "Fichier" };

export function EvidenceLibrary() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Tous");
  const [status, setStatus] = useState("Tous");

  const typeOptions = Array.from(new Set(evidenceLibrary.map((e) => e.type)));

  const filtered = evidenceLibrary.filter((e) => {
    const emp = employeeById(e.employeeId);
    if (search && !e.label.toLowerCase().includes(search.toLowerCase()) && !emp?.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (type !== "Tous" && e.type !== type) return false;
    if (status !== "Tous" && ((status === "Prêt" && !e.auditReady) || (status === "Incomplet" && e.auditReady))) return false;
    return true;
  });

  const auditReadyCount = evidenceLibrary.filter((e) => e.auditReady).length;
  const incompleteCount = evidenceLibrary.length - auditReadyCount;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tc-green/10 text-tc-green">
          <FolderCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">Bibliothèque de preuves</h1>
          <p className="text-sm text-slate-500">Preuves centralisées et exportables pour la préparation d'un audit COR.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ComplianceKpiCard label="Total des preuves" value={evidenceLibrary.length} icon={FolderCheck} tone="navy" />
        <ComplianceKpiCard label="Prêtes pour audit" value={auditReadyCount} icon={FileCheck2} tone="green" />
        <ComplianceKpiCard label="Incomplètes" value={incompleteCount} icon={Eye} tone="orange" />
        <ComplianceKpiCard label="Employés couverts" value={employees.length} icon={Award} tone="teal" />
      </div>

      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher une preuve ou un employé..."
        filters={[
          { key: "type", label: "Type", options: typeOptions, value: type, onChange: setType },
          { key: "status", label: "Statut", options: ["Prêt", "Incomplet"], value: status, onChange: setStatus },
        ]}
        onReset={() => { setSearch(""); setType("Tous"); setStatus("Tous"); }}
      />

      <div className="overflow-hidden rounded-2xl border border-tc-border bg-white shadow-sm">
        <div className="divide-y divide-tc-border">
          {filtered.map((e) => {
            const emp = employeeById(e.employeeId);
            const Icon = typeIcon[e.type];
            return (
              <div key={e.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/60">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tc-teal/10 text-tc-teal">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tc-navy text-[10px] font-bold text-white">
                  {emp?.photoInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-tc-text">{e.label}</div>
                  <div className="truncate text-xs text-slate-500">
                    {emp?.name} · lié à {e.linkedTo} · {e.date}
                  </div>
                </div>
                <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 sm:inline">
                  {typeLabel[e.type]}
                </span>
                <StatusBadge label={e.auditReady ? "Prêt pour audit" : "Incomplet"} tone={e.auditReady ? "green" : "orange"} className="text-[10px]" />
                <button className="rounded-lg p-2 text-slate-300 hover:bg-slate-100 hover:text-tc-navy2">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm text-slate-400">Aucune preuve ne correspond à ces filtres.</div>
          )}
        </div>
      </div>
    </div>
  );
}
