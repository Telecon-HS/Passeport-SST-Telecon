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
  const key = `status.${label}`;
  const shown = t(key) === key ? label : t(key);
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
