import { useApp } from "@/lib/app-context";
import { useAuth } from "@/lib/auth-context";
import { Search, Menu, ShieldHalf, LogOut, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from "@/lib/nav-config";
import { useT } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const { persona, role, screen, setScreen } = useApp();
  const { account, logout } = useAuth();
  const t = useT();
  const visible = navItems.filter((item) => item.roles.includes(role));
  const initials = persona.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("");

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
              <ShieldHalf className="h-4 w-4 text-white" />
            </div>
            <div className="font-display text-sm font-bold">{t("app.name")} Telecon</div>
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
                  {t(`nav.${item.id}`)}
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder={t("header.search")} className="border-tc-border bg-slate-50 pl-9 text-sm" />
      </div>

      <div className="flex-1" />

      <LanguageToggle />

      <span
        title={t(`roleFull.${role}`)}
        className="hidden cursor-help rounded-full border border-tc-border bg-slate-50 px-3 py-1 text-xs font-semibold text-tc-navy2 md:inline"
      >
        {t(`role.${role}`)}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-full border-l border-tc-border pl-3 text-left outline-none">
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-semibold text-tc-text">{persona.displayName}</div>
              <div className="text-xs text-slate-500">{t(`roleFull.${role}`)}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tc-navy text-xs font-bold text-white">
              {initials}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>
            <div className="text-sm font-semibold text-tc-text">{persona.displayName}</div>

            <div className="mt-1 text-[11px] font-normal leading-snug text-slate-500">
              {t(`roleFull.${role}`)}
            </div>
            <div className="mt-1 font-mono text-[11px] font-normal text-slate-400">
              {account?.username}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-xs">
            <User2 className="mr-2 h-3.5 w-3.5" />
            {t("header.scope")} : {t(`scope.${account?.scope ?? "self"}`)}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-tc-red focus:text-tc-red">
            <LogOut className="mr-2 h-4 w-4" /> {t("header.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
