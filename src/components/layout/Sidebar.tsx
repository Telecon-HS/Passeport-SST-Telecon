import { useApp } from "@/lib/app-context";
import { navItems } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import { ShieldHalf } from "lucide-react";

export function Sidebar() {
  const { role, screen, setScreen } = useApp();
  const visible = navItems.filter((item) => item.roles.includes(role));
  const principal = visible.filter((i) => i.section === "principal");
  const outils = visible.filter((i) => i.section === "outils");

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-tc-border bg-tc-navy lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tc-teal">
          <ShieldHalf className="h-4.5 w-4.5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-bold text-white">Passeport SST</div>
          <div className="text-[11px] font-medium text-white/50">Telecon</div>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5">
        <SidebarGroup label="Principal" items={principal} activeId={screen} onSelect={setScreen} />
        {outils.length > 0 && <SidebarGroup label="Outils" items={outils} activeId={screen} onSelect={setScreen} />}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3 text-[11px] leading-relaxed text-white/50">
          Prototype fonctionnel — données fictives. Intégrations SharePoint / Forms / eCompliance / Power BI à venir.
        </div>
      </div>
    </aside>
  );
}

function SidebarGroup({
  label,
  items,
  activeId,
  onSelect,
}: {
  label: string;
  items: typeof navItems;
  activeId: string;
  onSelect: (id: any) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-widest text-white/35">{label}</div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors",
                active ? "bg-tc-teal text-white shadow-sm" : "text-white/65 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
