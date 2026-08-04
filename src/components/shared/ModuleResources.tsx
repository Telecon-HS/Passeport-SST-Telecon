import type { TrainingResource } from "@/types";
import { PlayCircle, ClipboardCheck, Presentation, FileWarning, ExternalLink, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const icon = {
  video: PlayCircle,
  quiz: ClipboardCheck,
  presentation: Presentation,
  fichier: FileWarning,
} as const;

/**
 * Ressources réelles d'un module (vidéo, quiz Microsoft Forms, présentation).
 * Les ressources sans URL sont des fichiers internes non publiés : elles sont
 * affichées mais non cliquables, pour ne pas laisser croire à un lien mort.
 */
export function ModuleResources({
  resources,
  compact = false,
}: {
  resources: TrainingResource[];
  compact?: boolean;
}) {
  if (resources.length === 0) return null;

  return (
    <div className={cn("space-y-1.5", compact && "space-y-1")}>
      {resources.map((r, i) => {
        const Icon = icon[r.kind];
        const base = "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors";

        const content = (
          <>
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{r.label}</span>
              {r.fileName && (
                <span className="block truncate font-mono text-[10px] opacity-70">{r.fileName}</span>
              )}
              {r.caveat && (
                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-tc-orange">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  {r.caveat}
                </span>
              )}
            </span>
            {r.url && <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-50" />}
          </>
        );

        if (!r.url) {
          return (
            <div
              key={i}
              className={cn(base, "cursor-default border-dashed border-tc-border bg-slate-50 text-slate-500")}
              title="Fichier interne — non publié en ligne"
            >
              {content}
            </div>
          );
        }

        return (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(base, "border-tc-border text-tc-navy2 hover:border-tc-teal/50 hover:bg-tc-teal/[0.05]")}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
