import { useMemo, useState } from "react";
import { trainingCatalog, categoryOrder } from "@/data/trainingCatalog";
import { TrainingModuleCard } from "@/components/shared/TrainingModuleCard";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { GraduationCap, Info } from "lucide-react";

export function TrainingCenter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [language, setLanguage] = useState("Tous");
  const [bu, setBu] = useState("Tous");
  const [tqt, setTqt] = useState("Tous");

  const buOptions = useMemo(() => Array.from(new Set(trainingCatalog.flatMap((m) => m.businessUnits))).sort(), []);
  const tqtOptions = useMemo(() => Array.from(new Set(trainingCatalog.flatMap((m) => m.tqt))).filter(Boolean).sort(), []);

  const filtered = trainingCatalog.filter((m) => {
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "Tous" && m.category !== category) return false;
    if (language !== "Tous" && m.language !== language) return false;
    if (bu !== "Tous" && !m.businessUnits.includes(bu)) return false;
    if (tqt !== "Tous" && !m.tqt.includes(tqt)) return false;
    return true;
  });

  const grouped = categoryOrder
    .map((cat) => ({ cat, modules: filtered.filter((m) => m.category === cat) }))
    .filter((g) => g.modules.length > 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tc-teal/10 text-tc-teal">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">Centre de formation</h1>
          <p className="text-sm text-slate-500">{trainingCatalog.length} modules du catalogue SSE-800.</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-tc-border bg-white p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-tc-teal" />
        <div className="text-xs leading-relaxed text-slate-600">
          Les quiz d'<span className="font-medium">orientation</span> ne demandent pas de connexion —
          les comptes Microsoft ne sont généralement pas encore actifs à ce moment. Les quiz du
          <span className="font-medium"> Programme de développement des superviseurs</span> exigent
          une connexion au compte professionnel Microsoft.
          <br />
          Problème de connexion :{" "}
          <a href="https://support.telecon.ca/support/home" target="_blank" rel="noopener noreferrer"
             className="font-medium text-tc-navy2 underline">
            support.telecon.ca
          </a>{" "}
          · lien défectueux : signalez-le à votre HSBP.
        </div>
      </div>

      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher une formation ou un ID..."
        filters={[
          { key: "category", label: "Catégorie", options: categoryOrder, value: category, onChange: setCategory },
          { key: "bu", label: "BU", options: buOptions, value: bu, onChange: setBu },
          { key: "tqt", label: "TQT", options: tqtOptions, value: tqt, onChange: setTqt },
          { key: "lang", label: "Langue", options: ["FR", "EN", "Bilingual"], value: language, onChange: setLanguage },
        ]}
        onReset={() => { setSearch(""); setCategory("Tous"); setLanguage("Tous"); setBu("Tous"); setTqt("Tous"); }}
      />

      {grouped.length === 0 && (
        <div className="rounded-2xl border border-dashed border-tc-border py-16 text-center text-sm text-slate-400">
          Aucune formation ne correspond à ces filtres.
        </div>
      )}

      {grouped.map((g) => (
        <section key={g.cat}>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            {g.cat}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{g.modules.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.modules.map((m) => (
              <TrainingModuleCard key={m.id} module={m} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
