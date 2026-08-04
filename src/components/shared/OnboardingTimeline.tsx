import type { OnboardingCase } from "@/types";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingTimeline({ onboardingCase }: { onboardingCase: OnboardingCase }) {
  const doneCount = onboardingCase.steps.filter((s) => s.done).length;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {doneCount}/{onboardingCase.steps.length} étapes complétées
        </span>
      </div>
      <ol className="relative space-y-0">
        {onboardingCase.steps.map((step, idx) => (
          <li key={idx} className="relative flex gap-3 pb-5 last:pb-0">
            {idx < onboardingCase.steps.length - 1 && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-full w-px",
                  step.done ? "bg-tc-green/40" : "bg-tc-border"
                )}
              />
            )}
            <span
              className={cn(
                "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                step.done
                  ? "border-tc-green bg-tc-green text-white"
                  : "border-tc-border bg-white text-slate-300"
              )}
            >
              {step.done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2 fill-current" />}
            </span>
            <div className="pt-0.5">
              <div className={cn("text-sm font-medium", step.done ? "text-tc-text" : "text-slate-400")}>
                {step.label}
              </div>
              {step.date && <div className="text-xs text-slate-400">{step.date}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
