import { useMemo, useState } from "react";
import { matrixRules } from "@/data/matrixRules";
import { jobProfiles } from "@/data/jobProfiles";
import { MatrixRuleTable } from "@/components/shared/MatrixRuleTable";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, Users } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function TrainingMatrix() {
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("Tous");
  const [bu, setBu] = useState("Tous");
  const [client, setClient] = useState("Tous");
  const [province, setProvince] = useState("Tous");

  const familyOptions = useMemo(() => Array.from(new Set(matrixRules.map((r) => r.jobFamily))).sort(), []);
  const buOptions = useMemo(() => Array.from(new Set(matrixRules.map((r) => r.bu))).sort(), []);
  const clientOptions = useMemo(() => Array.from(new Set(matrixRules.map((r) => r.client))).sort(), []);
  const provinceOptions = useMemo(() => Array.from(new Set(matrixRules.map((r) => r.province))).sort(), []);

  const filtered = matrixRules.filter((r) => {
    if (search && !r.formationTitle.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.tqt.toLowerCase().includes(search.toLowerCase())) return false;
    if (family !== "Tous" && r.jobFamily !== family) return false;
    if (bu !== "Tous" && r.bu !== bu) return false;
    if (client !== "Tous" && r.client !== client) return false;
    if (province !== "Tous" && r.province !== province) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tc-navy/5 text-tc-navy2">
          <Grid3x3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-tc-navy">Matrice de formation</h1>
          <p className="text-sm text-slate-500">Règles poste + BU + client + projet + TQT — automatisation du profil requis.</p>
        </div>
      </div>

      <Tabs defaultValue="rules">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="rules">Règles avancées ({matrixRules.length})</TabsTrigger>
          <TabsTrigger value="profiles">Profils de postes ({jobProfiles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-4 space-y-4">
          <FilterPanel
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Rechercher une règle, un TQT, une formation..."
            filters={[
              { key: "family", label: "Famille métier", options: familyOptions, value: family, onChange: setFamily },
              { key: "bu", label: "BU", options: buOptions, value: bu, onChange: setBu },
              { key: "client", label: "Client", options: clientOptions, value: client, onChange: setClient },
              { key: "province", label: "Province", options: provinceOptions, value: province, onChange: setProvince },
            ]}
            onReset={() => { setSearch(""); setFamily("Tous"); setBu("Tous"); setClient("Tous"); setProvince("Tous"); }}
          />
          <MatrixRuleTable rules={filtered} />
        </TabsContent>

        <TabsContent value="profiles" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {jobProfiles.map((p) => (
              <div key={p.id} className="rounded-2xl border border-tc-border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-semibold text-tc-navy2">{p.id}</span>
                    <h3 className="text-sm font-bold text-tc-text">{p.position}</h3>
                    <p className="text-xs text-slate-500">{p.jobFamily} · BU par défaut : {p.defaultBU}</p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tc-navy/5 text-tc-navy2">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">{p.typicalTasks}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.dominantTqt.split(";").map((t) => (
                    <span key={t} className="rounded-md border border-tc-red/15 bg-tc-red/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-tc-red">
                      {t.trim()}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-tc-border pt-3 text-xs">
                  <StatusBadge label={`PSFCE : ${p.psfceRequired}`} tone={p.psfceRequired === "Non" ? "gray" : "teal"} className="text-[10px]" />
                  <StatusBadge label={`Mentor : ${p.mentorRequired}`} tone={p.mentorRequired === "Non" ? "gray" : "blue"} className="text-[10px]" />
                  <span className="text-slate-400">{p.minimalFormations.length} formations minimales</span>
                </div>
                <p className="mt-2 text-xs font-medium text-tc-navy2">{p.autonomyTarget}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
