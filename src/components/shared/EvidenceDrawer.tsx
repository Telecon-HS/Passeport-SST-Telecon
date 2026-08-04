import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { Evidence } from "@/types";
import { FileCheck2, FileText, Signature, Eye, Award } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

const typeIcon: Record<string, any> = {
  Quiz: FileCheck2,
  Certificate: Award,
  Observation: Eye,
  Signature: Signature,
  File: FileText,
};

const typeLabel: Record<string, string> = {
  Quiz: "Quiz",
  Certificate: "Certificat",
  Observation: "Observation",
  Signature: "Signature",
  File: "Fichier",
};

export function EvidenceDrawer({
  open,
  onOpenChange,
  employeeName,
  evidence,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employeeName: string;
  evidence: Evidence[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Preuves — {employeeName}</SheetTitle>
          <SheetDescription>Historique des preuves exportables pour un audit COR.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {evidence.map((ev) => {
            const Icon = typeIcon[ev.type] ?? FileText;
            return (
              <div key={ev.id} className="rounded-xl border border-tc-border bg-white p-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tc-teal/10 text-tc-teal">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{typeLabel[ev.type]}</span>
                      <StatusBadge
                        label={ev.auditReady ? "Prêt pour audit" : "Incomplet"}
                        tone={ev.auditReady ? "green" : "orange"}
                        className="text-[10px]"
                      />
                    </div>
                    <div className="mt-1 text-sm font-medium text-tc-text">{ev.label}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Lié à : {ev.linkedTo} · {ev.date}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {evidence.length === 0 && (
            <div className="rounded-xl border border-dashed border-tc-border py-10 text-center text-sm text-slate-400">
              Aucune preuve enregistrée pour cet employé.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
