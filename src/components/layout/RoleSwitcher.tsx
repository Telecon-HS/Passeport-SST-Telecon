import type { Role } from "@/types";
import { roleList } from "@/lib/nav-config";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { User, HardHat, LineChart, ShieldCheck, UserCog } from "lucide-react";

const roleIcon: Record<Role, any> = {
  "Employé": User,
  "Superviseur": HardHat,
  "Gestionnaire": LineChart,
  "PASS SST": ShieldCheck,
  "RH": UserCog,
};

export function RoleSwitcher() {
  const { role, setRole } = useApp();
  return (
    <div className="flex items-center gap-1 rounded-full border border-tc-border bg-slate-50 p-1">
      {roleList.map((r) => {
        const Icon = roleIcon[r];
        const active = role === r;
        return (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
              active ? "bg-tc-navy text-white shadow-sm" : "text-slate-500 hover:text-tc-navy"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">{r}</span>
          </button>
        );
      })}
    </div>
  );
}
