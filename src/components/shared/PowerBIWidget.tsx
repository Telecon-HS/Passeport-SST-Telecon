import type { ReactNode } from "react";
import { MoreHorizontal, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PowerBIWidget({
  title,
  subtitle,
  children,
  className,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col rounded-2xl border border-tc-border bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-sm font-bold text-tc-navy">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 text-slate-300">
          <Maximize2 className="h-3.5 w-3.5" />
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex-1">{children}</div>
      {footer && <div className="mt-3 border-t border-tc-border pt-3 text-xs text-slate-500">{footer}</div>}
    </div>
  );
}
