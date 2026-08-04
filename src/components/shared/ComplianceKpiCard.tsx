import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { complianceTone } from "@/lib/status";

export function ComplianceKpiCard({
  label,
  value,
  suffix,
  icon: Icon,
  trend,
  trendLabel,
  tone,
  onClick,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  tone?: "green" | "orange" | "red" | "navy" | "teal";
  onClick?: () => void;
}) {
  const resolvedTone = tone ?? (typeof value === "number" ? complianceTone(value) : "navy");
  const toneStyles: Record<string, string> = {
    green: "text-tc-green bg-tc-green/10",
    orange: "text-tc-orange bg-tc-orange/10",
    red: "text-tc-red bg-tc-red/10",
    navy: "text-tc-navy2 bg-tc-navy2/10",
    teal: "text-tc-teal bg-tc-teal/10",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-tc-green" : trend === "down" ? "text-tc-red" : "text-slate-400";

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-tc-border bg-white p-5 shadow-sm transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneStyles[resolvedTone])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            {trendLabel}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold tracking-tight text-tc-navy tabular-nums">{value}</span>
        {suffix && <span className="text-lg font-semibold text-slate-400">{suffix}</span>}
      </div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}
