import type { Authorization } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { authorizationTone, authorizationLabel } from "@/lib/status";
import { ShieldCheck, ShieldOff, ShieldHalf, ShieldX } from "lucide-react";

const iconByStatus: Record<string, any> = {
  Authorized: ShieldCheck,
  Supervised: ShieldHalf,
  "Not authorized": ShieldOff,
  Expired: ShieldX,
};

export function AuthorizationCard({ authorization }: { authorization: Authorization }) {
  const Icon = iconByStatus[authorization.status] ?? ShieldOff;
  const tone = authorizationTone(authorization.status);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-tc-border bg-white p-3.5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          background:
            tone === "green" ? "rgba(22,163,74,0.1)" : tone === "orange" ? "rgba(245,158,11,0.1)" : tone === "red" ? "rgba(220,38,38,0.1)" : "rgba(100,116,139,0.1)",
          color: tone === "green" ? "#16A34A" : tone === "orange" ? "#F59E0B" : tone === "red" ? "#DC2626" : "#64748B",
        }}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-tc-text">{authorization.activity}</div>
        <div className="truncate text-xs text-slate-500">
          {authorization.validatedBy ? `Validé par ${authorization.validatedBy}` : "Aucune validation"}
          {authorization.validUntil && ` · valide jusqu'au ${authorization.validUntil}`}
        </div>
      </div>
      <StatusBadge label={authorizationLabel(authorization.status)} tone={tone} />
    </div>
  );
}
