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
 * Ressources réelles d'un module, groupées par langue.
 * Les ressources sans URL sont des fichiers internes ou des liens manquants :
 * affichées mais non cliquables, pour ne pas laisser croire à un lien mort.
 */
export function ModuleResources({ resources }: { resources: TrainingResource[] }) {
  if (resources.length === 0) return null;

  const languages = Array.from(new Set(resources.map((r) => r.language)));

  return (
    <div className="space-y-2.5">
      {languages.map((lang) => (
        <div key={lang}>
          <div className="mb-1 flex items-center gap-1.5">
            <span className="rounded bg-tc-navy/[0.07] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-tc-navy2">
              {lang}
            </span>
          </div>
          <div className="space-y-1">
            {resources
              .filter((r) => r.language === lang)
              .map((r, i) => (
                <ResourceRow key={i} resource={r} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceRow({ resource: r }: { resource: TrainingResource }) {
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
          <span className="mt-0.5 flex items-start gap-1 text-[10px] text-tc-orange">
            <AlertTriangle className="mt-px h-3 w-3 shrink-0" />
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
        className={cn(base, "cursor-default border-dashed border-tc-border bg-slate-50 text-slate-500")}
        title="Ressource non publiée en ligne"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, "border-tc-border text-tc-navy2 hover:border-tc-teal/50 hover:bg-tc-teal/[0.05]")}
    >
      {content}
    </a>
  );
}
