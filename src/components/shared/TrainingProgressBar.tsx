import { cn } from "@/lib/utils";

export function TrainingProgressBar({
  value,
  className,
  showLabel = true,
  size = "md",
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const color = value >= 85 ? "bg-tc-green" : value >= 65 ? "bg-tc-orange" : "bg-tc-red";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex-1 rounded-full bg-slate-100 overflow-hidden", size === "sm" ? "h-1.5" : "h-2")}>
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all", color)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-600">{value}%</span>}
    </div>
  );
}
