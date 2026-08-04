import { useApp } from "@/lib/app-context";
import { useAuth } from "@/lib/auth-context";
import { useDataStore } from "@/lib/data-store";
import { navItems } from "@/lib/nav-config";
import { businessUnitScope } from "@/data/organization";
import { employeeById } from "@/data/employees";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { globalStatusTone } from "@/lib/status";
import { TrainingProgressBar } from "@/components/shared/TrainingProgressBar";
import { ArrowRight, Building2, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

function useGreeting() {
  const t = useT();
  const h = new Date().getHours();
  if (h < 12) return t("home.greetingMorning");
  if (h < 18) return t("home.greetingAfternoon");
  return t("home.greetingEvening");
}

export function Home() {
  const t = useT();
  const greeting = useGreeting;
  const { role, persona, setScreen, visibleEmployees } = useApp();
  const { account } = useAuth();
  const { psfce, authorizations, activity } = useDataStore();

  const me = persona.employeeId ? employeeById(persona.employeeId) : null;
  const scopedIds = new Set(visibleEmployees.map((e) => e.id));

  const shortcuts = navItems.filter((n) => n.id !== "home" && n.roles.includes(role));

  const openPsfce = psfce.filter(
    (p) => scopedIds.has(p.employeeId) && p.status !== "Completed"
  ).length;
  const blockedAuth = authorizations.filter(
    (a) => scopedIds.has(a.employeeId) && a.status !== "Authorized"
  ).length;
  const avgCompliance = visibleEmployees.length
    ? Math.round(visibleEmployees.reduce((s, e) => s + e.compliance, 0) / visibleEmployees.length)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-tc-navy">
          {greeting()}, {persona.displayName.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500">
          {persona.title} · {t("header.scope").toLowerCase()} {t(`scope.${account?.scope ?? "self"}`)}
        </p>
      </div>

      {/* Dossier personnel si le compte est rattaché à un employé */}
      {me && (
        <div className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tc-navy text-sm font-bold text-white">
                {me.photoInitials}
              </div>
              <div>
                <div className="text-sm font-semibold text-tc-text">{t("home.myStatus")}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {me.division ?? me.businessUnit}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {me.region} · {me.province}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-36">
                <TrainingProgressBar value={me.compliance} size="sm" />
              </div>
              <StatusBadge label={me.globalStatus} tone={globalStatusTone(me.globalStatus)} />
            </div>
          </div>
        </div>
      )}

      {/* Indicateurs de périmètre */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryTile label={t("home.avgCompliance")} value={`${avgCompliance} %`} tone={avgCompliance >= 85 ? "green" : avgCompliance >= 65 ? "orange" : "red"} />
        <SummaryTile label={t("home.openPsfce")} value={openPsfce} tone={openPsfce > 0 ? "teal" : "green"} />
        <SummaryTile label={t("home.pendingAuth")} value={blockedAuth} tone={blockedAuth > 0 ? "orange" : "green"} />
      </div>

      {/* Accès rapides */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          {t("home.shortcuts")}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className="group flex items-center gap-3 rounded-2xl border border-tc-border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-tc-teal/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tc-navy/5 text-tc-navy2">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="flex-1 text-sm font-semibold text-tc-text">{t(`nav.${item.id}`)}</span>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-tc-teal" />
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Portée de la BU */}
        {me && businessUnitScope[me.businessUnit as keyof typeof businessUnitScope] && (
          <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-sm font-bold text-tc-navy">
              {t("home.scopeOf")} — {me.businessUnit}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {businessUnitScope[me.businessUnit as keyof typeof businessUnitScope]}
            </p>
          </section>
        )}

        {/* Dernières actions */}
        <section className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h2 className="font-display text-sm font-bold text-tc-navy">{t("home.recentActions")}</h2>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-slate-400">{t("home.noActions")}</p>
          ) : (
            <div className="space-y-2">
              {activity.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-tc-text">{a.action}</div>
                    <div className="truncate text-slate-500">{a.target}</div>
                  </div>
                  <span className="shrink-0 text-slate-400">
                    {new Date(a.at).toLocaleDateString("fr-CA")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "green" | "orange" | "red" | "teal";
}) {
  const toneClass = {
    green: "text-tc-green",
    orange: "text-tc-orange",
    red: "text-tc-red",
    teal: "text-tc-teal",
  }[tone];
  return (
    <div className="rounded-2xl border border-tc-border bg-white p-5 shadow-sm">
      <div className={cn("font-display text-2xl font-bold tabular-nums", toneClass)}>{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}
