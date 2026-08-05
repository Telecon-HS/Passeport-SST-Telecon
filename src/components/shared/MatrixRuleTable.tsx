import type { MatrixRule } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { useT } from "@/lib/i18n";
import { makeDataLabel } from "@/lib/data-labels";

function psfceTone(v: string) {
  if (v === "Oui") return "teal" as const;
  if (v.startsWith("Selon")) return "orange" as const;
  return "gray" as const;
}

export function MatrixRuleTable({ rules }: { rules: MatrixRule[] }) {
  const t = useT();
  const dl = makeDataLabel(t);
  return (
    <div className="overflow-auto rounded-2xl border border-tc-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
            {[t("matrix.col.rule"),t("field.status"),t("matrix.col.buRegion"),t("field.position"),t("matrix.col.tqt"),t("matrix.col.requiredTraining"),"PSFCE",t("matrix.col.targetAuth"),t("matrix.col.corControl")].map((h) => (
              <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id} className="align-top">
              <TableCell className="font-mono text-xs font-semibold text-tc-navy2">{rule.id}</TableCell>
              <TableCell>
                <StatusBadge
                  label={dl(rule.status)}
                  tone={rule.status === "Proposé — à valider" ? "orange" : rule.status === "Profil de base" ? "gray" : "blue"}
                  className="text-[10px]"
                  dot={false}
                />
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium text-tc-text">{rule.bu}</div>
                <div className="text-xs text-slate-500">{rule.regions}</div>
              </TableCell>
              <TableCell className="max-w-[170px]">
                <div className="text-sm text-tc-text">{dl(rule.position)}</div>
                <div className="text-xs text-slate-500">{rule.positionLevel}</div>
              </TableCell>
              <TableCell className="max-w-[150px] text-xs text-slate-600">{dl(rule.tqt)}</TableCell>
              <TableCell className="max-w-[230px]">
                <div className="flex flex-wrap gap-1">
                  {rule.requiredModules.map((m) => (
                    <span key={m} className="rounded bg-tc-navy/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-medium text-tc-navy2">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">{rule.quizEvidence}</div>
              </TableCell>
              <TableCell>
                <StatusBadge label={rule.psfceRequired} tone={psfceTone(rule.psfceRequired)} className="text-[10px]" dot={false} />
              </TableCell>
              <TableCell className="max-w-[180px]">
                <div className="text-xs text-tc-text">{rule.targetAuthorization}</div>
                <div className="text-[11px] text-slate-400">{t("matrix.byDefault")} : {rule.defaultAuthorizationStatus}</div>
              </TableCell>
              <TableCell className="max-w-[150px] text-xs text-slate-600">
                {rule.corControl}
                <div className="mt-0.5 font-mono text-[10px] text-slate-400">{rule.bpmn}</div>
              </TableCell>
            </TableRow>
          ))}
          {rules.length === 0 && (
            <TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-slate-400">
              {t("common.noResults")}
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
