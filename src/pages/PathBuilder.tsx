import { useMemo, useState } from "react";
import { trainingCatalog } from "@/data/trainingCatalog";
import { matrixRules } from "@/data/matrixRules";
import { businessUnits, regions } from "@/data/organization";
import { useDataStore } from "@/lib/data-store";
import { useAuth } from "@/lib/auth-context";
import type { TrainingPath } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Route, Wand2, Save, Trash2, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const ANY = "Tous";

export function PathBuilder() {
  const { trainingPaths, addTrainingPath, deleteTrainingPath } = useDataStore();
  const { account } = useAuth();

  const [name, setName] = useState("");
  const [bu, setBu] = useState(ANY);
  const [position, setPosition] = useState(ANY);
  const [client, setClient] = useState(ANY);
  const [projectType, setProjectType] = useState(ANY);
  const [region, setRegion] = useState(ANY);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const positions = useMemo(() => {
    const scoped = bu === ANY ? matrixRules : matrixRules.filter((r) => r.bu === bu);
    return Array.from(new Set(scoped.map((r) => r.position))).sort();
  }, [bu]);

  const clients = useMemo(
    () => Array.from(new Set(matrixRules.map((r) => r.client))).filter((c) => c !== ANY).sort(),
    []
  );
  const projects = useMemo(
    () => Array.from(new Set(matrixRules.map((r) => r.projectType))).filter((p) => p !== ANY).sort(),
    []
  );

  /** Règles de matrice correspondant aux critères choisis. */
  const matching = useMemo(
    () =>
      matrixRules.filter(
        (r) =>
          (bu === ANY || r.bu === bu) &&
          (position === ANY || r.position === position) &&
          (client === ANY || r.client === client || r.client === "Tous") &&
          (projectType === ANY || r.projectType === projectType || r.projectType === "Tous") &&
          (region === ANY || r.regions === "Tous" || r.regions.includes(region))
      ),
    [bu, position, client, projectType, region]
  );

  const suggested = useMemo(() => {
    const ids = new Set<string>();
    matching.forEach((r) => r.requiredModules.forEach((m) => ids.add(m)));
    return Array.from(ids);
  }, [matching]);

  function applySuggestion() {
    setSelected(suggested);
    if (!name && position !== ANY) {
      setName(`${position}${bu !== ANY ? " — " + bu : ""}`);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  }

  function save() {
    if (!name.trim() || selected.length === 0) return;
    const path: TrainingPath = {
      id: "PATH-" + String(trainingPaths.length + 1).padStart(3, "0"),
      name: name.trim(),
      businessUnit: bu,
      position,
      client,
      projectType,
      region,
      moduleIds: selected,
      note: note.trim(),
      createdBy: account?.displayName ?? "—",
      createdAt: new Date().toISOString(),
    };
    addTrainingPath(path);
    setName("");
    setNote("");
    setSelected([]);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tc-navy/5 text-tc-navy2">
          <Route className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">Parcours de formation</h1>
          <p className="text-sm text-slate-500">
            Composez un parcours selon le poste, le projet, le client et la région.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Critères */}
        <div className="space-y-4 rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
          <h2 className="font-display text-sm font-bold text-tc-navy">Critères</h2>

          <Field label="Business Unit">
            <Select value={bu} onValueChange={(v) => { setBu(v); setPosition(ANY); }}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Toutes</SelectItem>
                {businessUnits.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Poste">
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Tous</SelectItem>
                {positions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Client">
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Tous</SelectItem>
                {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Type de projet">
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Tous</SelectItem>
                {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Région">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Toutes</SelectItem>
                {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            <span className="font-semibold">{matching.length}</span> règle(s) de matrice
            correspondante(s) · <span className="font-semibold">{suggested.length}</span> module(s)
            suggéré(s)
          </div>

          <Button onClick={applySuggestion} disabled={suggested.length === 0}
                  className="w-full bg-tc-teal text-xs hover:bg-tc-teal/90 disabled:opacity-40">
            <Wand2 className="mr-1.5 h-3.5 w-3.5" /> Proposer depuis la matrice
          </Button>
        </div>

        {/* Composition */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-display text-sm font-bold text-tc-navy">
              Modules du parcours ({selected.length})
            </h2>
            <div className="max-h-[320px] space-y-1 overflow-y-auto scrollbar-thin pr-1">
              {trainingCatalog.map((m) => {
                const on = selected.includes(m.id);
                const isSuggested = suggested.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      on ? "border-tc-teal bg-tc-teal/5" : "border-transparent hover:bg-slate-50"
                    )}
                  >
                    {on ? (
                      <CheckSquare className="h-4 w-4 shrink-0 text-tc-teal" />
                    ) : (
                      <Square className="h-4 w-4 shrink-0 text-slate-300" />
                    )}
                    <span className="font-mono text-[10px] text-slate-400">{m.id}</span>
                    <span className="min-w-0 flex-1 truncate text-tc-text">{m.title}</span>
                    {isSuggested && (
                      <span className="shrink-0 rounded bg-tc-navy/[0.07] px-1.5 py-0.5 text-[10px] font-medium text-tc-navy2">
                        matrice
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-tc-border pt-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Nom du parcours</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)}
                       placeholder="Ex. Monteur — Bell FTTH Québec" className="mt-1 h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Note</Label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={1}
                          placeholder="Contexte, exigence client particulière..." className="mt-1 text-xs" />
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button onClick={save} disabled={!name.trim() || selected.length === 0}
                      className="bg-tc-navy text-xs hover:bg-tc-navy2 disabled:opacity-40">
                <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le parcours
              </Button>
            </div>
          </div>

          {/* Parcours existants */}
          <div className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-display text-sm font-bold text-tc-navy">
              Parcours enregistrés ({trainingPaths.length})
            </h2>
            {trainingPaths.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Aucun parcours enregistré pour l'instant.
              </p>
            ) : (
              <div className="space-y-2">
                {trainingPaths.map((p) => (
                  <div key={p.id} className="flex items-start gap-3 rounded-xl border border-tc-border p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-tc-navy2">{p.id}</span>
                        <span className="text-sm font-semibold text-tc-text">{p.name}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {[p.businessUnit, p.position, p.client, p.projectType, p.region]
                          .filter((v) => v !== ANY)
                          .join(" · ") || "Aucun critère"}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.moduleIds.map((m) => (
                          <span key={m} className="rounded bg-tc-navy/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-tc-navy2">
                            {m}
                          </span>
                        ))}
                      </div>
                      {p.note && <p className="mt-1 text-xs italic text-slate-500">{p.note}</p>}
                      <p className="mt-1 text-[10px] text-slate-400">
                        Créé par {p.createdBy} le {new Date(p.createdAt).toLocaleDateString("fr-CA")}
                      </p>
                    </div>
                    <button onClick={() => deleteTrainingPath(p.id)}
                            className="rounded-lg p-1.5 text-slate-300 hover:bg-tc-red/10 hover:text-tc-red">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-slate-600">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
