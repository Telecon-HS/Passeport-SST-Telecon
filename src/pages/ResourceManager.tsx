import { useMemo, useState } from "react";
import { trainingCatalog } from "@/data/trainingCatalog";
import { useDataStore } from "@/lib/data-store";
import { useAuth } from "@/lib/auth-context";
import type { TrainingResource, ResourceKind } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useT } from "@/lib/i18n";
import { moduleStatusTone } from "@/lib/status";
import { Link2, Plus, Trash2, RotateCcw, Save, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const kinds: ResourceKind[] = ["video", "quiz", "presentation", "fichier"];

export function ResourceManager() {
  const t = useT();
  const { trainingCatalogWithOverrides, saveModuleResources, resetModuleResources, resourceOverrides } =
    useResourceEditing();
  const { account } = useAuth();
  const [search, setSearch] = useState("");
  const [onlyIncomplete, setOnlyIncomplete] = useState("Tous");
  const [selectedId, setSelectedId] = useState(trainingCatalog[0]?.id ?? "");
  const [draft, setDraft] = useState<TrainingResource[] | null>(null);

  const modules = useMemo(() => {
    return trainingCatalogWithOverrides.filter((m) => {
      if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.id.toLowerCase().includes(search.toLowerCase()))
        return false;
      const incomplete = (m.resources ?? []).some((r) => !r.url);
      if (onlyIncomplete === "À compléter" && !incomplete) return false;
      if (onlyIncomplete === "Complet" && incomplete) return false;
      return true;
    });
  }, [trainingCatalogWithOverrides, search, onlyIncomplete]);

  const selected = trainingCatalogWithOverrides.find((m) => m.id === selectedId) ?? modules[0];
  const current = draft ?? selected?.resources ?? [];
  const dirty = draft !== null;

  function edit(index: number, patch: Partial<TrainingResource>) {
    const next = current.map((r, i) => (i === index ? { ...r, ...patch } : r));
    setDraft(next);
  }

  function addRow() {
    setDraft([...current, { kind: "video", language: "FR", label: "", url: "" }]);
  }

  function removeRow(index: number) {
    setDraft(current.filter((_, i) => i !== index));
  }

  function save() {
    if (!selected) return;
    const cleaned = current.map((r) => ({
      ...r,
      label: r.label.trim(),
      url: r.url?.trim() ? r.url.trim() : undefined,
      fileName: r.fileName?.trim() ? r.fileName.trim() : undefined,
      caveat: r.caveat?.trim() ? r.caveat.trim() : undefined,
    }));
    saveModuleResources(selected.id, cleaned);
    setDraft(null);
  }

  const missingCount = trainingCatalogWithOverrides.reduce(
    (n, m) => n + (m.resources ?? []).filter((r) => !r.url).length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tc-teal/10 text-tc-teal">
          <Link2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">{t("res.title")}</h1>
          <p className="text-sm text-slate-500">
            {t("res.subtitle")} · {missingCount} {t("res.missing")}
          </p>
        </div>
      </div>

      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("res.searchPlaceholder")}
        filters={[
          {
            key: "state",
            label: t("field.status"),
            options: ["À compléter", "Complet"],
            value: onlyIncomplete,
            onChange: setOnlyIncomplete,
          },
        ]}
        onReset={() => {
          setSearch("");
          setOnlyIncomplete("Tous");
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="max-h-[70vh] space-y-1.5 overflow-y-auto scrollbar-thin pr-1">
          {modules.map((m) => {
            const incomplete = (m.resources ?? []).filter((r) => !r.url).length;
            const overridden = Boolean(resourceOverrides[m.id]);
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedId(m.id);
                  setDraft(null);
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                  selected?.id === m.id
                    ? "border-tc-teal bg-tc-teal/5 shadow-sm"
                    : "border-tc-border bg-white hover:bg-slate-50"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold text-tc-navy2">{m.id}</span>
                    {overridden && (
                      <span className="rounded bg-tc-teal/10 px-1 text-[9px] font-semibold text-tc-teal">
                        {t("res.modified")}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-sm font-medium text-tc-text">{m.title}</div>
                  <div className="text-[11px] text-slate-400">
                    {(m.resources ?? []).length} ressource(s)
                  </div>
                </div>
                {incomplete > 0 ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-tc-orange">
                    <AlertTriangle className="h-3 w-3" />
                    {incomplete}
                  </span>
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-tc-green" />
                )}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-tc-border pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-tc-navy">{selected.title}</h2>
                  <p className="text-xs text-slate-500">
                    {selected.id} · {selected.category} · {selected.language}
                  </p>
                </div>
                <StatusBadge label={selected.status} tone={moduleStatusTone(selected.status)} className="text-[10px]" />
              </div>

              <div className="mt-4 space-y-3">
                {current.map((r, i) => (
                  <div key={i} className="rounded-xl border border-tc-border p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={r.kind} onValueChange={(v) => edit(i, { kind: v as ResourceKind })}>
                        <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {kinds.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={r.language} onValueChange={(v) => edit(i, { language: v as "FR" | "EN" })}>
                        <SelectTrigger className="h-8 w-20 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FR">FR</SelectItem>
                          <SelectItem value="EN">EN</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={r.label}
                        onChange={(e) => edit(i, { label: e.target.value })}
                        placeholder="Libellé affiché"
                        className="h-8 flex-1 min-w-[160px] text-xs"
                      />
                      <button
                        onClick={() => removeRow(i)}
                        className="rounded-lg p-1.5 text-slate-300 hover:bg-tc-red/10 hover:text-tc-red"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <Label className="text-[10px] text-slate-500">{t("res.link")}</Label>
                        <div className="mt-0.5 flex items-center gap-1">
                          <Input
                            value={r.url ?? ""}
                            onChange={(e) => edit(i, { url: e.target.value })}
                            placeholder="https://..."
                            className="h-8 text-xs"
                          />
                          {r.url && (
                            <a href={r.url} target="_blank" rel="noopener noreferrer"
                               className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-tc-teal">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-[10px] text-slate-500">{t("res.internalFile")}</Label>
                        <Input
                          value={r.fileName ?? ""}
                          onChange={(e) => edit(i, { fileName: e.target.value })}
                          placeholder="Nom du fichier .mp4 / .pptx"
                          className="mt-0.5 h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <Label className="text-[10px] text-slate-500">{t("res.caveat")}</Label>
                      <Input
                        value={r.caveat ?? ""}
                        onChange={(e) => edit(i, { caveat: e.target.value })}
                        placeholder="Ex. traduction à vérifier"
                        className="mt-0.5 h-8 text-xs"
                      />
                    </div>

                    {!r.url && (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-tc-orange">
                        <AlertTriangle className="h-3 w-3" />
                        {t("res.noLinkWarning")}
                      </p>
                    )}
                  </div>
                ))}

                {current.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">
                    {t("res.noResources")}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-tc-border pt-4">
                <Button variant="outline" size="sm" onClick={addRow} className="border-tc-border text-xs">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> {t("res.addResource")}
                </Button>
                <div className="flex items-center gap-2">
                  {resourceOverrides[selected.id] && (
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => { resetModuleResources(selected.id); setDraft(null); }}
                      className="text-xs text-slate-500"
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> {t("res.backToOrigin")}
                    </Button>
                  )}
                  <Button
                    size="sm" onClick={save} disabled={!dirty}
                    className="bg-tc-navy text-xs hover:bg-tc-navy2 disabled:opacity-40"
                  >
                    <Save className="mr-1.5 h-3.5 w-3.5" /> {t("action.save")}
                  </Button>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                Modifications enregistrées sous {account?.displayName} et tracées dans le journal
                d'activité.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-tc-border py-16 text-center text-sm text-slate-400">
              {t("res.selectModule")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Catalogue enrichi des ressources {t("res.modified")}es par le gestionnaire de programme. */
export function useResourceEditing() {
  const store = useDataStore();
  const trainingCatalogWithOverrides = useMemo(
    () =>
      trainingCatalog.map((m) =>
        store.resourceOverrides[m.id] ? { ...m, resources: store.resourceOverrides[m.id] } : m
      ),
    [store.resourceOverrides]
  );
  return { ...store, trainingCatalogWithOverrides };
}
