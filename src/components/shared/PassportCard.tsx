import type { Employee } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { globalStatusTone } from "@/lib/status";
import { TrainingProgressBar } from "./TrainingProgressBar";
import { MapPin, Building2, User, Calendar, CreditCard } from "lucide-react";

export function PassportCard({ employee }: { employee: Employee }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-tc-border bg-gradient-to-br from-tc-navy via-tc-navy to-tc-navy2 p-6 text-white shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-tc-teal/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl font-bold font-display backdrop-blur">
            {employee.photoInitials}
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-tc-teal/90">
              <CreditCard className="h-3.5 w-3.5" /> Passeport SST numérique
            </div>
            <h2 className="mt-0.5 font-display text-2xl font-bold">{employee.name}</h2>
            <p className="text-sm text-white/70">{employee.position} · {employee.employeeNumber}</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <StatusBadge label={employee.globalStatus} tone={globalStatusTone(employee.globalStatus)} className="bg-white/10 text-white border-white/20 [&>span]:bg-white" />
          <div className="w-40">
            <TrainingProgressBar value={employee.compliance} size="sm" />
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-4 text-xs sm:grid-cols-4">
        <div className="flex items-center gap-2 text-white/85">
          <Building2 className="h-3.5 w-3.5 text-tc-teal" />
          <div>
            <div className="text-white/50">Business Unit</div>
            <div className="font-medium">{employee.businessUnit}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/85">
          <MapPin className="h-3.5 w-3.5 text-tc-teal" />
          <div>
            <div className="text-white/50">Région</div>
            <div className="font-medium">{employee.region} · {employee.province}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/85">
          <User className="h-3.5 w-3.5 text-tc-teal" />
          <div>
            <div className="text-white/50">Gestionnaire</div>
            <div className="font-medium">{employee.manager}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/85">
          <Calendar className="h-3.5 w-3.5 text-tc-teal" />
          <div>
            <div className="text-white/50">Date d'arrivée</div>
            <div className="font-medium">{employee.startDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
