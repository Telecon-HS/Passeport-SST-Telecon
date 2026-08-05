import type { TrainingModule } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { moduleStatusTone } from "@/lib/status";
import { PlayCircle, FileText, Presentation, ExternalLink, ClipboardCheck, Users } from "lucide-react";

import { ModuleResources } from "./ModuleResources";
import { useI18n } from "@/lib/i18n";
import { makeDataLabel, moduleTitle } from "@/lib/data-labels";

const deliveryIcon: Record<string, any> = {
  Video: PlayCircle,
  YouTube: PlayCircle,
  "YouTube playlist": PlayCircle,
  Stream: PlayCircle,
  "Stream / YouTube": PlayCircle,
  PowerPoint: Presentation,
  "PPT / Video": Presentation,
  External: ExternalLink,
  Presentation: Presentation,
};

export function TrainingModuleCard({
  module,
  onLaunch,
}: {
  module: TrainingModule;
  onLaunch?: () => void;
}) {
  const { t, lang } = useI18n();
  const dl = makeDataLabel(t);
  const Icon = deliveryIcon[module.delivery] ?? FileText;
  return (
    <div className="group rounded-2xl border border-tc-border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-tc-teal/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tc-navy/5 text-tc-navy2">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <StatusBadge label={module.status} tone={moduleStatusTone(module.status)} className="text-[10px] py-0" />
      </div>
      <h4 className="mt-3 text-sm font-semibold leading-snug text-tc-text line-clamp-2">{moduleTitle(module, lang)}</h4>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium">{module.id}</span>
        <span>{module.language}</span>
        <span>·</span>
        <span>{module.delivery}</span>
      </div>
      {module.tqt.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {module.tqt.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-md bg-tc-red/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-tc-red border border-tc-red/15">
              {dl(tag)}
            </span>
          ))}
        </div>
      )}
      {module.resources && module.resources.length > 0 && (
        <div className="mt-3 border-t border-tc-border pt-3">
          <ModuleResources resources={module.resources} />
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-tc-border pt-3">
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          {module.requiresQuiz && (
            <span className="flex items-center gap-1">
              <ClipboardCheck className="h-3.5 w-3.5" /> Quiz
            </span>
          )}
          {module.psfceRequirement !== "Non" && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> PSFCE
            </span>
          )}
        </div>
        {(() => {
          const primary = module.resources?.find((r) => r.kind !== "quiz" && r.url);
          if (!primary) return null;
          return (
            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onLaunch}
              className="text-xs font-semibold text-tc-teal hover:underline"
            >
              {t("action.launch")} →
            </a>
          );
        })()}
      </div>
    </div>
  );
}
