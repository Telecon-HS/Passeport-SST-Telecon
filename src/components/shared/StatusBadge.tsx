import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { toneClasses, toneDot } from "@/lib/status";
import type { StatusTone } from "@/lib/status";

export function StatusBadge({
  label,
  tone,
  className,
  dot = true,
}: {
  label: string;
  tone: StatusTone;
  className?: string;
  dot?: boolean;
}) {
  const t = useT();
  const statusKey = `status.${label}`;
  const dataKey = `data.${label}`;
  const shown =
    t(statusKey) !== statusKey ? t(statusKey) : t(dataKey) !== dataKey ? t(dataKey) : label;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClasses(tone),
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", toneDot(tone))} />}
      {shown}
    </span>
  );
}
