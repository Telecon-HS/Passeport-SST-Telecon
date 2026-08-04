import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export function FilterPanel({
  search,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filters,
  onReset,
}: {
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  filters: FilterConfig[];
  onReset?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-tc-border bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5 pl-1 pr-2 text-slate-400">
        <SlidersHorizontal className="h-4 w-4" />
      </div>
      {onSearchChange && (
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 border-tc-border pl-8 text-sm"
          />
        </div>
      )}
      {filters.map((f) => (
        <Select key={f.key} value={f.value} onValueChange={f.onChange}>
          <SelectTrigger className="h-8 w-auto min-w-[130px] border-tc-border text-xs">
            <SelectValue placeholder={f.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">{f.label} : Tous</SelectItem>
            {f.options.filter((opt) => opt !== "Tous").map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {onReset && (
        <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500" onClick={onReset}>
          <X className="mr-1 h-3.5 w-3.5" /> Réinitialiser
        </Button>
      )}
    </div>
  );
}
