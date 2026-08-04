import type { Employee } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { globalStatusTone } from "@/lib/status";
import { TrainingProgressBar } from "./TrainingProgressBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/lib/app-context";

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const { navigateToPassport } = useApp();
  return (
    <div className="overflow-hidden rounded-2xl border border-tc-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Employé</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Poste / BU</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Région</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conformité</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Statut</TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow
              key={emp.id}
              className="cursor-pointer"
              onClick={() => navigateToPassport(emp.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tc-navy text-[11px] font-bold text-white">
                    {emp.photoInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-tc-text">{emp.name}</div>
                    <div className="truncate text-xs text-slate-500">{emp.employeeNumber}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-tc-text">{emp.position}</div>
                <div className="text-xs text-slate-500">{emp.businessUnit}</div>
              </TableCell>
              <TableCell><div className="text-sm text-tc-text">{emp.region}</div><div className="text-xs text-slate-500">{emp.province}</div></TableCell>
              <TableCell className="w-40">
                <TrainingProgressBar value={emp.compliance} size="sm" />
              </TableCell>
              <TableCell>
                <StatusBadge label={emp.globalStatus} tone={globalStatusTone(emp.globalStatus)} />
              </TableCell>
              <TableCell>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </TableCell>
            </TableRow>
          ))}
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-400">
                Aucun employé ne correspond aux filtres sélectionnés.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
