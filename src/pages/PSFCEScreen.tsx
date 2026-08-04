import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { useDataStore } from "@/lib/data-store";
import { employeeById } from "@/data/employees";
import type { PSFCE } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { psfceTone, psfceLabel } from "@/lib/status";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";
import { CheckCircle2, Circle, Plus, UserCheck, Save } from "lucide-react";

export function PSFCEScreen() {
  const t = useT();
  const { visibleEmployees, canViewEmployee } = useApp();
  const { psfce, togglePsfceStep, addPsfce, addPsfceObservation } = useDataStore();

  const scoped = useMemo(
    () => psfce.filter((p) => canViewEmployee(p.employeeId)),
    [psfce, canViewEmployee]
  );

  const [selectedId, setSelectedId] = useState<string>(scoped[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: "", competency: "", mentor: "" });
  const [note, setNote] = useState("");

  const selected = scoped.find((p) => p.id === selectedId) ?? scoped[0];

  function createPsfce() {
    if (!form.employeeId || !form.competency.trim()) return;
    const id = "PSFCE-" + String(psfce.length + 1).padStart(3, "0");
    const record: PSFCE = {
      id,
      employeeId: form.employeeId,
      competency: form.competency.trim(),
      mentor: form.mentor.trim() || "À assigner",
      status: "Not started",
      level: "Beginner",
      observations: [],
      steps: [
        { label: "Orientation complétée", done: false },
        { label: "Observation initiale par mentor", done: false },
        { label: "Démonstration supervisée", done: false },
        { label: "Validation finale superviseur", done: false },
      ],
    };
    addPsfce(record);
    setSelectedId(id);
    setForm({ employeeId: "", competency: "", mentor: "" });
    setOpen(false);
  }

  function saveNote() {
    if (!selected || !note.trim()) return;
    addPsfceObservation(selected.id, note.trim());
    setNote("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">
            {t("psfce.title")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("psfce.subtitle")}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-tc-navy hover:bg-tc-navy2">
              <Plus className="mr-2 h-4 w-4" /> {t("psfce.new")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{t("psfce.create")}</DialogTitle>
              <DialogDescription>Encadrez le développement terrain d'un employé de votre périmètre.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">{t("field.employee")}</Label>
                <Select value={form.employeeId} onValueChange={(v) => setForm({ ...form, employeeId: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner un employé" /></SelectTrigger>
                  <SelectContent>
                    {visibleEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name} — {e.position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">{t("psfce.competency")}</Label>
                <Input className="mt-1" value={form.competency}
                  onChange={(e) => setForm({ ...form, competency: e.target.value })}
                  placeholder="Ex. Excavation sécuritaire" />
              </div>
              <div>
                <Label className="text-xs">{t("psfce.mentor")}</Label>
                <Input className="mt-1" value={form.mentor}
                  onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                  placeholder="Ex. Jordan Lee" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>{t("action.cancel")}</Button>
              <Button className="bg-tc-navy hover:bg-tc-navy2" onClick={createPsfce}>{t("psfce.create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          {scoped.map((p) => {
            const emp = employeeById(p.employeeId);
            const active = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  active ? "border-tc-teal bg-tc-teal/5 shadow-sm" : "border-tc-border bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tc-navy text-[11px] font-bold text-white">
                  {emp?.photoInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-tc-text">{emp?.name}</div>
                  <div className="truncate text-xs text-slate-500">{p.competency}</div>
                </div>
                <StatusBadge label={psfceLabel(p.status)} tone={psfceTone(p.status)} className="text-[10px]" dot={false} />
              </button>
            );
          })}
          {scoped.length === 0 && (
            <div className="rounded-xl border border-dashed border-tc-border py-10 text-center text-sm text-slate-400">
              {t("psfce.noneInScope")}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-2xl border border-tc-border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-tc-navy">{selected.competency}</h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {t("field.employee")} : {employeeById(selected.employeeId)?.name} · {t("psfce.mentor")} : {selected.mentor}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={psfceLabel(selected.status)} tone={psfceTone(selected.status)} />
                  <span className="rounded-full border border-tc-border px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    {t("psfce.level")} : {selected.level === "Beginner" ? "Débutant" : selected.level === "Intermediate" ? "Intermédiaire" : "Compétent"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">{t("psfce.steps")}</h3>
                <div className="space-y-2">
                  {selected.steps.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => togglePsfceStep(selected.id, i)}
                      className="flex w-full items-center gap-3 rounded-lg border border-tc-border px-3 py-2.5 text-left hover:bg-slate-50"
                    >
                      {s.done
                        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-tc-green" />
                        : <Circle className="h-4 w-4 shrink-0 text-slate-300" />}
                      <span className={cn("text-sm", s.done ? "text-tc-text" : "text-slate-500")}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">{t("psfce.observations")}</h3>
                <div className="space-y-2">
                  {selected.observations.length === 0 && (
                    <p className="text-sm text-slate-400">{t("psfce.noObservations")}</p>
                  )}
                  {selected.observations.map((o, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{o}</div>
                  ))}
                </div>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("psfce.addObservation")}
                  className="mt-3 border-tc-border text-sm"
                  rows={2}
                />
                <Button
                  onClick={saveNote}
                  disabled={!note.trim()}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-tc-border text-xs disabled:opacity-40"
                >
                  <Save className="mr-1.5 h-3.5 w-3.5" /> {t("psfce.saveObservation")}
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-tc-border pt-4">
                <span className="text-xs text-slate-400">
                  {t("psfce.decisionNote")}
                </span>
                <Button
                  disabled={selected.status !== "Completed"}
                  className="bg-tc-green hover:bg-tc-green/90 disabled:opacity-40"
                >
                  <UserCheck className="mr-2 h-4 w-4" /> {t("psfce.authorize")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-tc-border py-16 text-center text-sm text-slate-400">
              {t("psfce.selectOne")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
