import type { MatrixRule } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { riskTone } from "@/lib/status";

export function MatrixRuleTable({ rules }: { rules: MatrixRule[] }) {
  return (
    <div className="overflow-auto rounded-2xl border border-tc-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Règle</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Famille / Poste</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client / Province</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">TQT</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Formation</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Moment / Fréquence</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preuve</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risque</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-mono text-xs font-semibold text-tc-navy2">{rule.id}</TableCell>
              <TableCell>
                <div className="text-sm font-medium text-tc-text">{rule.jobFamily}</div>
                <div className="text-xs text-slate-500">{rule.position}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-tc-text">{rule.client}</div>
                <div className="text-xs text-slate-500">{rule.province}</div>
              </TableCell>
              <TableCell className="max-w-[160px] text-xs text-slate-600">{rule.tqt}</TableCell>
              <TableCell className="max-w-[220px]">
                <div className="text-sm text-tc-text">{rule.formationTitle}</div>
                <div className="text-xs font-mono text-slate-400">{rule.formationId}</div>
              </TableCell>
              <TableCell className="max-w-[160px] text-xs text-slate-600">
                {rule.moment} <br /> <span className="text-slate-400">{rule.frequency}</span>
              </TableCell>
              <TableCell className="max-w-[160px] text-xs text-slate-600">{rule.evidence}</TableCell>
              <TableCell>
                <StatusBadge label={rule.riskPriority} tone={riskTone(rule.riskPriority)} className="text-[10px]" />
              </TableCell>
              <TableCell>
                <span className="text-xs font-medium text-slate-500">{rule.status}</span>
              </TableCell>
            </TableRow>
          ))}
          {rules.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-10 text-center text-sm text-slate-400">
                Aucune règle ne correspond aux filtres sélectionnés.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
