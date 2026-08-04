import { useApp } from "@/lib/app-context";
import { roleList } from "@/lib/nav-config";
import type { Role } from "@/types";
import { User, HardHat, LineChart, ShieldCheck, UserCog, ArrowRight, Mail, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const roleMeta: Record<Role, { icon: any; desc: string; color: string }> = {
  "Employé": { icon: User, desc: "Consultez votre passeport SST, vos formations, quiz, TQT et autorisations.", color: "bg-tc-teal" },
  "Superviseur": { icon: HardHat, desc: "Suivez votre équipe, créez les PSFCE et autorisez le travail autonome.", color: "bg-tc-navy2" },
  "Gestionnaire": { icon: LineChart, desc: "Suivez la conformité globale, les risques et les échéances par BU.", color: "bg-tc-orange" },
  "PASS SST": { icon: ShieldCheck, desc: "Administrez la matrice, les TQT, les formations et la préparation COR.", color: "bg-tc-red" },
  "RH": { icon: UserCog, desc: "Déclenchez l'onboarding et validez le statut avant le premier jour.", color: "bg-tc-green" },
};

export function Home() {
  const { setRole } = useApp();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-tc-border bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-tc-green" /> Prototype fonctionnel · Données fictives
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-tc-navy">Passeport SST Telecon</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          La synthèse numérique individuelle qui répond en un coup d'œil : la personne est-elle formée, autorisée,
          et prête pour un audit COR ? Choisissez un rôle pour explorer l'expérience correspondante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roleList.map((r) => {
          const meta = roleMeta[r];
          const Icon = meta.icon;
          return (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="group relative flex flex-col items-start rounded-2xl border border-tc-border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white", meta.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-tc-navy">{r}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{meta.desc}</p>
              <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-tc-teal opacity-0 transition-opacity group-hover:opacity-100">
                Entrer dans le rôle <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}

        <div className="flex flex-col justify-center rounded-2xl border border-dashed border-tc-border bg-slate-50/60 p-5">
          <Mail className="h-5 w-5 text-slate-400" />
          <h3 className="mt-3 font-display text-sm font-bold text-tc-navy">Déclencheur du processus</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            Le parcours démarre par un courriel RH confirmant une embauche, puis se déroule automatiquement :
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-500">
            {["Profil SST", "Matrice", "Orientation", "Formations", "Quiz", "PSFCE", "Autorisation", "COR"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-1">
                <span className="rounded-full bg-white px-2 py-1 shadow-sm border border-tc-border">{s}</span>
                {i < arr.length - 1 && <ArrowDown className="h-3 w-3 -rotate-90 text-slate-300" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
