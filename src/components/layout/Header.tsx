import { useApp } from "@/lib/app-context";
import { RoleSwitcher } from "./RoleSwitcher";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import { ShieldHalf } from "lucide-react";

export function Header() {
  const { persona, role, screen, setScreen } = useApp();
  const visible = navItems.filter((item) => item.roles.includes(role));

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-tc-border bg-white/90 px-4 backdrop-blur sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-tc-navy p-0 text-white">
          <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tc-teal">
              <ShieldHalf className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="font-display text-sm font-bold">Passeport SST Telecon</div>
          </div>
          <nav className="p-3">
            {visible.map((item) => {
              const Icon = item.icon;
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium",
                    active ? "bg-tc-teal text-white" : "text-white/70 hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Rechercher un employé, une formation..." className="border-tc-border bg-slate-50 pl-9 text-sm" />
      </div>

      <div className="flex-1" />

      <RoleSwitcher />

      <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-tc-navy">
        <Bell className="h-4.5 w-4.5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-tc-red ring-2 ring-white" />
      </button>

      <div className="flex items-center gap-2.5 border-l border-tc-border pl-3">
        <div className="hidden text-right leading-tight sm:block">
          <div className="text-sm font-semibold text-tc-text">{persona.displayName}</div>
          <div className="text-xs text-slate-500">{persona.title}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tc-navy text-xs font-bold text-white">
          {persona.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
      </div>
    </header>
  );
}
