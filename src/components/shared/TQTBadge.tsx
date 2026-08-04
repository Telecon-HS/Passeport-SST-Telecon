import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function TQTBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-tc-red/25 bg-tc-red/[0.06] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-tc-red",
        className
      )}
    >
      <ShieldAlert className="h-3 w-3" />
      {label}
    </span>
  );
}
