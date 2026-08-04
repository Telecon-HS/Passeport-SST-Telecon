import { useDataStore } from "@/lib/data-store";
import { isPersistent } from "@/lib/storage";
import { History, RotateCcw, HardDriveDownload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("fr-CA", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export function ActivityJournal() {
  const { activity, resetAll } = useDataStore();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tc-navy/5 text-tc-navy2">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-tc-navy">Journal d'activité</h1>
            <p className="text-sm text-slate-500">
              Trace des actions réalisées dans l'application — appui à la traçabilité COR.
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-tc-border text-sm">
              <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser les données
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Réinitialiser les données du prototype</DialogTitle>
              <DialogDescription>
                Toutes les modifications enregistrées (progression PSFCE, autorisations accordées,
                formations complétées, préférences et journal) seront effacées et remplacées par le
                jeu de données de départ. Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={resetAll}>
                Effacer et repartir des données initiales
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-tc-border bg-white p-4">
        <HardDriveDownload className="mt-0.5 h-4 w-4 shrink-0 text-tc-teal" />
        <div className="text-xs leading-relaxed text-slate-600">
          {isPersistent() ? (
            <>
              Les données sont conservées dans le navigateur de cet appareil. Elles ne sont pas
              synchronisées entre postes ni entre utilisateurs — une base de données partagée sera
              nécessaire pour un déploiement réel.
            </>
          ) : (
            <>
              Le stockage local est indisponible dans ce contexte : les modifications restent en
              mémoire et seront perdues au rafraîchissement.
            </>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-tc-border bg-white shadow-sm">
        {activity.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-slate-300" />
            <p className="mt-3 text-sm text-slate-400">
              Aucune action enregistrée pour l'instant.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Validez une étape PSFCE ou accordez une autorisation pour alimenter le journal.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-tc-border">
            {activity.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-4 py-3">
                <div className="w-36 shrink-0 font-mono text-[11px] text-slate-400">
                  {formatDate(entry.at)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-tc-text">{entry.action}</div>
                  <div className="truncate text-xs text-slate-500">{entry.target}</div>
                </div>
                <div className="shrink-0 text-xs font-medium text-tc-navy2">{entry.actor}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
