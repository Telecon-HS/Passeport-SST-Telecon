import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Info } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-tc-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex items-center justify-center gap-2 border-b border-tc-orange/25 bg-tc-orange/[0.07] px-4 py-1.5 text-center text-[11px] font-medium text-tc-orange">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Prototype — dossiers, noms et résultats entièrement fictifs. Aucune personne réelle n'est représentée.
        </div>
        <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>
      </div>
    </div>
  );
}
